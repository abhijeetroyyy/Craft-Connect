import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { AiFillPhone, AiOutlineGoogle, AiOutlineClose } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Handle input changes
  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Field validation
  const validateFields = useCallback(() => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!isLogin && !formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    if (!isLogin && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!isLogin && !formData.name) newErrors.name = "Name is required.";
    if (!isLogin && !formData.role) newErrors.role = "Role is required.";
    if (!isLogin && !formData.phone)
      newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  // Form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateFields()) return;

      try {
        const hashedPassword = await bcrypt.hash(formData.password, 10);

        if (isLogin) {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          toast.success("Welcome back!");
          onClose(); // Close modal on successful login
        } else {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          const user = userCredential.user;
          const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            password: hashedPassword,
          };
          await setDoc(doc(db, "users", user.uid), userData);
          toast.success("Account created successfully!");
          onClose(); // Close modal on successful registration
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email is already registered.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email format.");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Incorrect password.");
        } else if (error.code === "auth/user-not-found") {
          toast.error("No user found with this email.");
        } else {
          toast.error(error.message);
        }
      }
    },
    [isLogin, formData, validateFields, onClose]
  );

  // Social login
  const handleSocialLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      onClose(); // Close modal on successful login
    } catch (error) {
      toast.error(error.message);
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-[#212121] rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
          {isLogin
            ? "Login to access your account"
            : "Fill in the details to get started"}
        </p>

        {/* Form */}
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
                {passwordVisibility.confirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
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

        {/* Social Login */}
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
