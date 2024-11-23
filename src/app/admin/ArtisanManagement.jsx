import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, doc, updateDoc, query, where } from '@/components/firebase-config';

const ArtisanManagement = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        // Query to fetch artisans who have products listed
        const artisansSnapshot = await getDocs(collection(db, 'artisans'));
        const artisansList = artisansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtisans(artisansList);
      } catch (error) {
        console.error('Error fetching artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  // Handle artisan approval/rejection
  const handleApproval = async (artisanId, status) => {
    try {
      const artisanRef = doc(db, 'artisans', artisanId);
      await updateDoc(artisanRef, { approvalStatus: status });
      alert(`Artisan ${status}`);
      
      // Update local state to reflect the approval status change
      const updatedArtisans = artisans.map(artisan =>
        artisan.id === artisanId ? { ...artisan, approvalStatus: status } : artisan
      );
      setArtisans(updatedArtisans);
    } catch (error) {
      console.error('Error updating artisan approval status:', error);
    }
  };

  // View Artisan Profile
  const viewArtisanProfile = (artisan) => {
    setSelectedArtisan(artisan);
  };

  // Close Artisan Profile Modal
  const closeProfileModal = () => {
    setSelectedArtisan(null);
  };

  if (loading) return <div>Loading artisans...</div>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Artisan Management</h2>

      {/* Artisan List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Artisan List</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Number of Products</th>
              <th className="border p-3">Approval Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map(artisan => (
              <tr key={artisan.id}>
                <td className="border p-3">{artisan.name}</td>
                <td className="border p-3">{artisan.email}</td>
                <td className="border p-3">{artisan.products.length}</td>
                <td className="border p-3">{artisan.approvalStatus}</td>
                <td className="border p-3">
                  <button
                    onClick={() => viewArtisanProfile(artisan)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    View Profile
                  </button>
                  {artisan.approvalStatus === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleApproval(artisan.id, 'Approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(artisan.id, 'Rejected')}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Artisan Profile Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Artisan Profile</h3>
            <p><strong>Name:</strong> {selectedArtisan.name}</p>
            <p><strong>Email:</strong> {selectedArtisan.email}</p>
            <p><strong>Approval Status:</strong> {selectedArtisan.approvalStatus}</p>
            <p><strong>Products Listed:</strong> {selectedArtisan.products.length}</p>

            <h4 className="text-xl font-semibold mt-4">Product Listings</h4>
            <ul className="list-disc pl-5">
              {selectedArtisan.products.map((product, index) => (
                <li key={index}>
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>

            <button
              onClick={closeProfileModal}
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

export default ArtisanManagement;
