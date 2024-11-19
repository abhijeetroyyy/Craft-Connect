'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all transform"
        onClick={(e) => e.stopPropagation()} // Prevents modal close when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{isLogin ? "Login" : "Register"}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
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
        <form>
          {isLogin ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-blue-600 text-white hover:bg-blue-500"
              >
                Register
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
