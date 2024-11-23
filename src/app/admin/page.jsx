"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from './AdminSidebar';

const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials for simplicity (username, password, OTP)
    const correctUsername = 'abhijeetroy';
    const correctPassword = 'abhijeetroy';
    const correctOtp = '000000';

    // Check if the credentials are correct
    if (username === correctUsername && password === correctPassword && otp === correctOtp) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials or OTP');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="w-96 p-8 bg-white shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium mb-2">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <Footer />
    </>
  );
};

export default AdminPage;
