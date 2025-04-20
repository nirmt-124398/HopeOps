import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDonations from '../components/user/UserDonations';

const UserDonationsPage = () => {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Donation History</h1>
        <p className="text-gray-600">
          Thank you for your generous support! Here's a record of your contributions to our mission.
        </p>
      </div>
      
      <UserDonations />
    </div>
  );
};

export default UserDonationsPage;
