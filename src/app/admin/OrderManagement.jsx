import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, doc, updateDoc } from '@/components/firebase-config';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle updating order status
  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
      alert(`Order marked as ${status}`);
      // Refresh the order list after status update
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Handle refund or cancel order
  const handleOrderCancel = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'Cancelled' });
      alert('Order cancelled successfully');
      // Refresh the order list after cancellation
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Order Management</h2>

      {/* Order List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Order List</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-3">Order ID</th>
              <th className="border p-3">Customer Name</th>
              <th className="border p-3">Order Date</th>
              <th className="border p-3">Order Status</th>
              <th className="border p-3">Total Price</th>
              <th className="border p-3">Payment Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border p-3">{order.id}</td>
                <td className="border p-3">{order.customerName}</td>
                <td className="border p-3">{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</td>
                <td className="border p-3">{order.status}</td>
                <td className="border p-3">${order.totalPrice}</td>
                <td className="border p-3">{order.paymentStatus}</td>
                <td className="border p-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOrderStatusUpdate(order.id, 'Shipped')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Mark as Shipped
                  </button>
                  <button
                    onClick={() => handleOrderCancel(order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate.seconds * 1000).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>
            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>

            <h4 className="text-xl font-semibold mt-4">Ordered Products</h4>
            <ul className="list-disc pl-5">
              {selectedOrder.products.map((product, index) => (
                <li key={index}>
                  {product.name} - {product.quantity} x ${product.price}
                </li>
              ))}
            </ul>

            <h4 className="text-xl font-semibold mt-4">Shipping Address</h4>
            <p>{selectedOrder.shippingAddress}</p>

            <h4 className="text-xl font-semibold mt-4">Payment Information</h4>
            <p>{selectedOrder.paymentMethod}</p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
