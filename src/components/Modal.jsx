import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { AiFillPhone, AiOutlineGoogle, AiOutlineClose } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import zxcvbn from "zxcvbn"; // For password strength
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Password validation function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return passwordRegex.test(password);
};

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    username: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Handle input changes
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const strength = zxcvbn(value).score; // Calculate password strength
      setPasswordStrength(strength);
    }
  }, []);

  // Validate fields
  const validateFields = useCallback(() => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.";
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isLogin && !formData.name) newErrors.name = "Full name is required.";
    if (!isLogin && !formData.username)
      newErrors.username = "Username is required.";
    if (!isLogin && !formData.role) newErrors.role = "Role is required.";
    if (!isLogin && !formData.phone)
      newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateFields()) return;

      try {
        let user;
        if (isLogin) {
          // Login flow
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          user = userCredential.user;
          toast.success("Welcome back!");
        } else {
          // Registration flow
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          user = userCredential.user;

          // Update profile with username
          await updateProfile(user, {
            displayName: formData.username,
          });

          // Save user details in Firestore
          const userData = {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            phone: formData.phone,
            role: formData.role,
            loginMethod: "email",
            createdAt: new Date(),
            lastLogin: new Date(),
          };

          await setDoc(doc(db, "users", user.uid), userData);
          toast.success("Account created successfully!");
        }

        onClose(); // Close modal upon success
      } catch (error) {
        console.error("Authentication error:", error);
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email is already registered.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email format.");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password is too weak.");
        } else {
          toast.error(error.message);
        }
      }
    },
    [isLogin, formData, validateFields, onClose]
  );

  // Handle Google login
  const handleSocialLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const userData = {
          name: user.displayName || "",
          email: user.email,
          username: "", // Prompt user to set a username
          phone: user.phoneNumber || "",
          loginMethod: "google",
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), userData);
        toast.info("Please complete your profile by setting a username.");
      }

      toast.success(`Welcome, ${user.displayName || "User"}!`);
      onClose(); // Close modal upon success
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message);
    }
  }, [onClose]);

  // Render password strength meter
  const renderPasswordStrength = () => {
    const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    const strengthColors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-700",
    ];

    return (
      <div className="mt-2">
        <div className="flex space-x-1 h-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`flex-1 rounded ${
                passwordStrength > index
                  ? strengthColors[passwordStrength]
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        {formData.password && (
          <p
            className={`text-sm mt-1 ${
              passwordStrength < 2
                ? "text-red-500"
                : passwordStrength < 4
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {strengthLabels[passwordStrength]}
          </p>
        )}
      </div>
    );
  };

  // JSX rendering
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-[#212121] rounded-lg shadow-2xl max-w-md w-full p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
          {isLogin
            ? "Login to access your account"
            : "Fill in the details to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <AiFillPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          )}

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={passwordVisibility.password ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {passwordVisibility.password ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
            {renderPasswordStrength()}
          </div>

          {!isLogin && (
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {passwordVisibility.confirmPassword ? (
                  <MdVisibilityOff />
                ) : (
                  <MdVisibility />
                )}
              </button>
            </div>
          )}

          <div className="text-center">
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Button
            type="button"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg flex justify-center items-center gap-3 hover:bg-red-700"
            onClick={handleSocialLogin}
          >
            <AiOutlineGoogle size={20} />
            Sign in with Google
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin((prev) => !prev)}
              className="text-blue-600 cursor-pointer"
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;