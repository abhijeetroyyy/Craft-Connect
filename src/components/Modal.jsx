'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });

  // Focus on the first input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.querySelector("input[autofocus]")?.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!isLogin && !formData.name) newErrors.name = "Name is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with form submission (this is where you'd call an API)
    console.log("Form submitted:", formData);
    onClose(); // Close modal after submission
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-500"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all transform scale-95 hover:scale-100 duration-500"
        onClick={(e) => e.stopPropagation()} // Prevents modal close when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{isLogin ? "Login" : "Register"}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-3xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-6 mb-6">
          <button
            className={`py-2 px-4 w-full text-sm font-semibold rounded-lg transition-colors ${
              isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            } hover:bg-blue-500 hover:text-white`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 w-full text-sm font-semibold rounded-lg transition-colors ${
              !isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            } hover:bg-blue-500 hover:text-white`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              autoFocus
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <Button
            type="submit"
            variant="outline"
            className="w-full bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-600 rounded-lg py-3 transition-all mb-4"
          >
            {isLogin ? "Login" : "Register"}
          </Button>

          {/* Social login buttons */}
          <div className="flex justify-between mb-4 space-x-2">
            <button
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex justify-center items-center"
              onClick={() => handleSocialLogin('Google')}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png"
                alt="Google logo"
                className="w-6 h-6 mr-2"
              />
              Google
            </button>
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex justify-center items-center"
              onClick={() => handleSocialLogin('Microsoft')}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo_%282012%29.svg"
                alt="Microsoft logo"
                className="w-6 h-6 mr-2"
              />
              Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
