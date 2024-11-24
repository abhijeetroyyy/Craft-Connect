import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, doc, updateDoc } from '@/components/firebase-config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  // Function to handle account status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      alert(`Account status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Function to handle user profile view and edit
  const handleProfileEdit = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Open a modal or a new page with user's editable details
      // This can be handled with a separate component or a modal
      alert(`Edit profile for ${user.username}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">User Management</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-3">Username</th>
            <th className="border p-3">Email Address</th>
            <th className="border p-3">Role</th>
            <th className="border p-3">Account Status</th>
            <th className="border p-3">Date of Registration</th>
            <th className="border p-3">Last Login</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-3">{user.username}</td>
              <td className="border p-3">{user.email}</td>
              <td className="border p-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="artisan">Artisan</option>
                </select>
              </td>
              <td className="border p-3">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </td>
              <td className="border p-3">{user.dateJoined}</td>
              <td className="border p-3">{user.lastLogin}</td>
              <td className="border p-3">
                <button
                  onClick={() => handleProfileEdit(user.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
