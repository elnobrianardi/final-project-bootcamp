'use client';

import { fetchAllUser, updateRole } from '@/services/admin/user';
import Cookies from 'js-cookie';
import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify'; // Import toast

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState(null); // Dedicated for initial fetch errors
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch all user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setInitialFetchError(null); // Clear initial fetch error before new fetch

      const storedToken = Cookies.get('token');

      if (!storedToken) {
        setInitialFetchError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchAllUser(storedToken);
        setUsers(response || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setInitialFetchError(err?.message || 'Failed to load user data. Please try again.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => user.name && user.name.toLowerCase().includes(lowercasedSearchTerm));
  }, [users, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const { currentItems, totalPages, pageNumbers, indexOfFirstItem } = useMemo(() => {
    const totalItems = filteredUsers.length;
    const total = Math.ceil(totalItems / itemsPerPage);
    const calculatedIndexOfLastItem = currentPage * itemsPerPage;
    const calculatedIndexOfFirstItem = calculatedIndexOfLastItem - itemsPerPage;
    const slicedItems = filteredUsers.slice(calculatedIndexOfFirstItem, calculatedIndexOfLastItem);

    const numbers = [];
    if (total > 0) {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(total, currentPage + 2);

      if (endPage - startPage + 1 < 5) {
        if (currentPage - startPage < 2) {
          endPage = Math.min(total, startPage + 4);
        } else {
          startPage = Math.max(1, endPage - 4);
        }
      }

      while (endPage - startPage + 1 < 5 && endPage < total) {
        endPage++;
      }
      while (endPage - startPage + 1 < 5 && startPage > 1) {
        startPage--;
      }

      for (let i = startPage; i <= endPage; i++) {
        numbers.push(i);
      }
    }

    return {
      currentItems: slicedItems,
      totalPages: total,
      pageNumbers: numbers,
      indexOfFirstItem: calculatedIndexOfFirstItem
    };
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page >= 1 && page <= totalPages) { // Added currentPage >= 1 check for safety
      setCurrentPage(page);
    }
  };

  // Handle role change for a user
  // handle role change for a user
const handleRoleChange = async (userId, newRole) => {
  const originalUsers = [...users]; // Save current state for rollback

  // Optimistically update UI
  setUsers(prevUsers =>
    prevUsers.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    )
  );
  setUpdatingUserId(userId);

  try {
    const token = Cookies.get('token');

    if (!token) {
      console.error('Authentication token not found. Cannot update role.');
      toast.error('Authentication token missing. Please log in again.');
      setUsers(originalUsers); // Rollback
      setUpdatingUserId(null);
      return;
    }

    const response = await updateRole(userId, newRole, token);

    // --- CRITICAL CHANGE HERE ---
    // Assuming your API returns something like { success: true, message: "User role updated" }
    // OR if response itself is truthy on success, and has a 'message' field.
    if (response && response.message) { // Check if response exists and has a message
      console.log(`Successfully updated user ${userId} to role: ${newRole}`);
      toast.success(response.message); // Use the actual message from the API
      // If your API sends a 'code' field even for success, and it's not 200,
      // you might still want to specifically check for `response.code === 200`
      // or `response.status === 'success'` depending on its structure.
      // For now, checking for `response && response.message` is a good general catch-all for success.
      // IMPORTANT: DO NOT setUsers(originalUsers) here, as the optimistic update is correct!
    } else {
      // This block runs if the API call didn't explicitly throw an error,
      // but the response structure doesn't indicate success (e.g., no message or code).
      console.warn(`Unexpected API response for user ${userId}:`, response);
      toast.error(response?.message || `Failed to update role for user ${userId} (unexpected API response).`);
      setUsers(originalUsers); // Rollback because we couldn't confirm success
    }

  } catch (err) {
    // This catch block will execute if `updateRole` throws an error (e.g., network error, 4xx/5xx HTTP status from API).
    console.error(`Error updating role for user ${userId}:`, err);
    const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
    toast.error(errorMessage); // Show error toast
    setUsers(originalUsers); // Rollback
  } finally {
    setUpdatingUserId(null);
  }
};

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading user data...</p>
      </div>
    );
  }

  // Render critical error state (e.g., initial data fetch failed)
  // This error state is specifically for issues preventing the table from loading at all
  if (initialFetchError) { // Use initialFetchError here
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">Error: {initialFetchError}</p>
      </div>
    );
  }

  // Render no data available state (after loading and no initial error)
  if (users.length === 0 && !loading && !initialFetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">No user data available.</p>
      </div>
    );
  }

  // Main content render
  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <div className='flex justify-between py-2'>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">All Users</h1>
        <input
          type='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search by name..'
          className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* No more separate error/success divs here. Toastify handles it! */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">No.</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user.id || user.email || index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700">{indexOfFirstItem + index + 1}.</td>
                <td className="py-3 px-4 text-sm text-gray-700">{user.name}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className='flex items-center space-x-2'>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className='px-2 py-1 rounded-md text-xs font-medium border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      disabled={updatingUserId === user.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {updatingUserId === user.id && (
                      <span className='text-blue-500 text-xs'>Updating...</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{user.phoneNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-blue-700 text-white font-bold shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
      <p className="text-center text-sm text-gray-600 mt-4">
        Displaying {currentItems.length} users on this page. Total {users.length} users across {totalPages} pages.
      </p>
    </div>
  );
};

export default AllUser;