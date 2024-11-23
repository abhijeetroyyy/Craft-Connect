// src/app/admin/DashboardOverview.jsx
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from '@/components/firebase-config';  // Correct import path
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeUsers: 0,
    totalSales: 0,
    productsAdded: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        // Fetch total orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        setMetrics(prev => ({ ...prev, totalOrders: orders.length }));

        // Fetch active users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const activeUsers = usersSnapshot.docs.filter(doc => doc.data().isActive).length;
        setMetrics(prev => ({ ...prev, activeUsers }));

        // Fetch total sales
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        setMetrics(prev => ({ ...prev, totalSales }));

        // Fetch products added
        const productsSnapshot = await getDocs(collection(db, 'products'));
        setMetrics(prev => ({ ...prev, productsAdded: productsSnapshot.docs.length }));

        // Fetch recent activities (e.g., new user registrations, orders, products)
        const recentDocs = [...orders, ...usersSnapshot.docs.map(doc => doc.data()), ...productsSnapshot.docs.map(doc => doc.data())];
        setRecentActivity(recentDocs.slice(-5)); // Show last 5 activities

        // Fetch sales trends (for example: sales data for the last 6 months)
        const salesTrendData = [
          { month: 'January', sales: 120 },
          { month: 'February', sales: 150 },
          { month: 'March', sales: 180 },
          { month: 'April', sales: 220 },
          { month: 'May', sales: 200 },
          { month: 'June', sales: 250 },
        ];
        setSalesData(salesTrendData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Sales chart data
  const salesChartData = {
    labels: salesData.map(data => data.month),
    datasets: [
      {
        label: 'Sales Trend',
        data: salesData.map(data => data.sales),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Dashboard Overview</h2>

      {/* General Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{metrics.totalOrders}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-2xl">{metrics.activeUsers}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl">${metrics.totalSales}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Products Added</h3>
          <p className="text-2xl">{metrics.productsAdded}</p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-lg font-semibold mb-4">Sales Trend (Last 6 Months)</h3>
        <Line data={salesChartData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ul>
          {recentActivity.slice(0, 5).map((activity, index) => (
            <li key={index} className="mb-3">
              <span className="font-semibold">{activity.name || 'Activity'}</span>: {activity.description || 'Details'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;
