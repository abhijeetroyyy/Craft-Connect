"use client";

import { useState, useEffect } from "react";
import {
  auth,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateDoc,
  doc,
} from "@/components/firebase-config"; // Adjust path as needed
import {
  onAuthStateChanged,
  updateEmail,
} from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    // Check user authentication and fetch user details
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(currentUser);
          setFormData({
            fullName: userDoc.data().fullName || "",
            email: currentUser.email || "",
            phone: userDoc.data().phone || "",
            dob: userDoc.data().dob || "",
            gender: userDoc.data().gender || "",
          });
          if (userDoc.data().profilePic) {
            setProfilePic(userDoc.data().profilePic);
          }
          setAddresses(userDoc.data().addresses || []);
          setWishlist(userDoc.data().wishlist || []);
          setOrderHistory(userDoc.data().orderHistory || []);
        }
      } else {
        // Redirect to login if not authenticated
        document.location.href = "/login";
      }
    });
    return unsubscribe;
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload profile picture
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    setUploading(true);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePic(url);
      await updateDoc(doc(db, "users", user.uid), { profilePic: url });
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  // Update user details
  const handleSaveChanges = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        addresses,
        wishlist,
      });

      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
    }
  };

  // Add new address
  const handleAddAddress = () => {
    setAddresses([...addresses, { address: "", isDefault: false }]);
  };

  // Update address
  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].address = value;
    setAddresses(updatedAddresses);
  };

  // Delete address
  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  // Logout
  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out successfully!");
    document.location.href = "/login";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6  mx-auto bg-white dark:bg-[#212121]">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Account Settings</h1>

      {/* Profile Picture */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Profile Picture</h2>
        <div className="flex items-center mt-2">
          <img
            src={profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            className="ml-4"
          />
          {uploading && <p className="ml-2 text-sm text-blue-500">Uploading...</p>}
        </div>
      </div>

      {/* Basic Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Basic Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Address Book */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Address Book</h2>
        {addresses.map((address, index) => (
          <div key={index} className="flex items-center mt-2">
            <input
              type="text"
              value={address.address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              className="w-full p-2 border rounded dark:bg-[#333] dark:text-white dark:border-gray-600"
              placeholder="Address"
            />
            <button
              onClick={() => handleDeleteAddress(index)}
              className="ml-2 text-red-500 hover:underline dark:text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleAddAddress}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Add Address
        </button>
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSaveChanges}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600"
      >
        Save Changes
      </button>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
