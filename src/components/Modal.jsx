import { useState, useCallback } from "react";
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
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return passwordRegex.test(password);
};

// Error Messages Map
const errorMessages = new Map([
  ["auth/email-already-in-use", "Email is already registered."],
  ["auth/invalid-email", "Invalid email format."],
  ["auth/user-not-found", "No user found with this email."],
  ["auth/wrong-password", "Incorrect password."],
  ["auth/weak-password", "Password is too weak."],
  ["auth/network-request-failed", "Network error. Please try again later."],
]);

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const initialFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    username: "",
    phone: "",
    role: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Toggle between Login and Sign Up forms
  const toggleForm = useCallback(() => {
    setIsLogin((prev) => !prev);
    setFormData(initialFormData); // Reset form data
    setErrors({}); // Clear errors
    setPasswordStrength(0); // Reset password strength
  }, [initialFormData]);

  // Handle input changes
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      // Calculate password strength only when the password changes
      setPasswordStrength(zxcvbn(value).score);
    }
  }, []);

  // Validate all fields before submission
  const validateFields = useCallback(() => {
    const newErrors = {};
    const { email, password, confirmPassword, name, username, phone, role } =
      formData;

    if (!email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.";
    }
    if (!isLogin) {
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
      if (!name) newErrors.name = "Full name is required.";
      if (!username) newErrors.username = "Username is required.";
      if (!phone) newErrors.phone = "Phone number is required.";
      if (!role) newErrors.role = "Role is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  // Handle form submission
  const handleSubmit = async (e) => {
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

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          throw new Error(
            "User data not found in the database. Please contact support."
          );
        }

        toast.success(`Welcome back, ${userDoc.data().username || "User"}!`);
      } else {
        // Registration flow
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        user = userCredential.user;

        await updateProfile(user, {
          displayName: formData.username,
        });

        const userData = {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          phone: formData.phone,
          role: formData.role,
          loginMethod: "email",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", user.uid), userData);

        toast.success("Account created successfully!");
      }
      // Reset form data and state after successful submission
      setFormData(initialFormData);
      setErrors({});
      setPasswordStrength(0);

      onClose(); // Close modal upon success
    } catch (error) {
      console.error("Authentication error:", error);

      // Use error message map for known Firebase errors
      const errorMessage =
        errorMessages.get(error.code) || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  // Handle social login with Google
  const handleSocialLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const userData = {
          name: user.displayName || "",
          email: user.email,
          username: "",
          phone: user.phoneNumber || "",
          role: "",
          loginMethod: "google",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", user.uid), userData);
        toast.info("Please complete your profile by setting a username.");
      }

      toast.success(`Welcome, ${user.displayName || "User"}!`);
      onClose();
    } catch (error) {
      console.error("Google login error:", error);

      // Handle unexpected errors
      const errorMessage =
        errorMessages.get(error.code) || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    const strengthLabels = [
      "Very Weak",
      "Weak",
      "Medium",
      "Strong",
      "Very Strong",
    ];
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-[#1E1E2C] rounded-xl shadow-2xl w-full max-w-md lg:max-w-lg p-8 overflow-y-auto max-h-[90%] hide-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition duration-200"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-3">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {isLogin
            ? "Log in to continue."
            : "Fill in the details below to create your account."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <InputField
                Icon={FiUser}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                error={errors.name}
              />
              <InputField
                Icon={FiUser}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                error={errors.username}
              />
            </>
          )}

          <InputField
            Icon={FiMail}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            error={errors.email}
          />

          <PasswordField
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            visibility={passwordVisibility.password}
            onToggleVisibility={() =>
              setPasswordVisibility((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
            error={errors.password}
          />

          {!isLogin && renderPasswordStrength()}

          {!isLogin && (
            <>
              <PasswordField
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                visibility={passwordVisibility.confirmPassword}
                onToggleVisibility={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
                error={errors.confirmPassword}
              />
              <InputField
                Icon={AiFillPhone}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                error={errors.phone}
              />
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-[#262637] dark:text-white"
                >
                  <option value="">Select Role</option>
                  <option value="Seller">Seller</option>
                  <option value="Buyer">Buyer</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-300 transition duration-200"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="ml-2 text-blue-500 hover:underline dark:text-blue-400"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Or continue with:</p>
          <button
            type="button"
            onClick={handleSocialLogin}
            className="mt-4 flex items-center justify-center w-full py-3 bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition duration-200"
          >
            <AiOutlineGoogle size={24} />
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({ Icon, name, type = "text", value, onChange, placeholder, error }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-[#262637] dark:text-white dark:placeholder-gray-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable PasswordField Component
const PasswordField = ({
  name,
  value,
  onChange,
  placeholder,
  visibility,
  onToggleVisibility,
  error,
}) => (
  <div className="relative">
    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
    <input
      type={visibility ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-[#262637] dark:text-white dark:placeholder-gray-500"
    />
    <button
      type="button"
      onClick={onToggleVisibility}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
    >
      {visibility ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
    </button>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Modal;