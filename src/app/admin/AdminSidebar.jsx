"use client"
import React, { useState } from 'react';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import ArtisanManagement from './ArtisanManagement';
import PaymentTransactions from './PaymentTransactions';

const AdminSidebar = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  // Function to handle sidebar item click
  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-800 text-white">
        <div className="p-5 text-xl font-bold">Admin Panel</div>
        <ul className="mt-10 space-y-4">
          <li>
            <button
              onClick={() => handleSidebarClick('Dashboard')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              Dashboard Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick('UserManagement')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick('ProductManagement')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              Product Management
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick('OrderManagement')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              Order Management
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick('ArtisanManagement')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              Artisan Management
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSidebarClick('PaymentTransactions')}
              className="block w-full px-4 py-2 hover:bg-gray-700 rounded text-left"
            >
              Payment & Transactions
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-4">Admin Panel</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Dynamically render the component based on state */}
          {activeComponent === 'Dashboard' && <DashboardOverview />}
          {activeComponent === 'UserManagement' && <UserManagement />}
          {activeComponent === 'ProductManagement' && <ProductManagement />}
          {activeComponent === 'OrderManagement' && <OrderManagement />}
          {activeComponent === 'ArtisanManagement' && <ArtisanManagement />}
          {activeComponent === 'PaymentTransactions' && <PaymentTransactions />}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
