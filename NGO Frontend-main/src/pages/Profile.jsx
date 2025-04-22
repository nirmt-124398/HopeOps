import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../utils/apifile';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import UserDonations from '../components/user/UserDonations';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [userEmergencies, setUserEmergencies] = useState([]);
  const [loadingEmergencies, setLoadingEmergencies] = useState(false);
  const [emergencyError, setEmergencyError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get('/user/profile');
        const userData = response.data;

        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          newPassword: '',
          confirmPassword: ''
        });

        updateUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile', error);

        if (error.response?.status === 429) {
          alert('Too many requests. Please wait a moment before trying again.');
        }

        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchUserEmergencies = async () => {
      if (!user) return;

      try {
        setLoadingEmergencies(true);
        const response = await apiRequest.get('/emergencies');

        const userFilteredEmergencies = response.data.filter(
          emergency => emergency.userId === user.id
        );

        setUserEmergencies(userFilteredEmergencies);
        setEmergencyError(null);
      } catch (err) {
        console.error('Error fetching emergency reports:', err);
        setEmergencyError('Failed to load your emergency reports. Please try again.');
      } finally {
        setLoadingEmergencies(false);
      }
    };

    fetchUserEmergencies();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await apiRequest.put('/user/profile', updateData);

      updateUser(response.data);

      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));

      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await apiRequest.delete('/user/profile');
        alert('Account deleted successfully');
        logout();
        navigate('/');
      } catch (error) {
        console.error('Failed to delete account', error);
        alert('Failed to delete account');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'RESOLVED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="w-full">
          {isEditing ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Edit Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                      />

                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Leave password fields empty if you don't want to change your password.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Account Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4">
                    {formData.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{formData.username || user?.username || 'User'}</h3>
                    <p className="text-gray-500">{user?.role || 'User'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Email</span>
                    <span>{formData.email || user?.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Password</span>
                    <div className="flex items-center">
                      <span className="mr-2">••••••••</span>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <h2 className="text-xl font-bold text-white mb-1">Your Emergency Reports</h2>
            <p className="text-white text-opacity-80 text-sm">Track the status of animal emergencies you've reported</p>
          </div>

          <div className="p-6">
            {emergencyError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p>{emergencyError}</p>
                  </div>
                </div>
              </div>
            )}

            {loadingEmergencies ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading your emergency reports...</p>
              </div>
            ) : userEmergencies.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No emergency reports</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't reported any animal emergencies yet. When you do, they'll appear here.</p>
                <Button
                  variant="primary"
                  as="a"
                  href="/report-incident"
                  className="px-6 py-2.5"
                >
                  Report an Emergency
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {userEmergencies.map(emergency => (
                  <div key={emergency.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                            emergency.status === 'RESOLVED' ? 'bg-green-100' :
                            emergency.status === 'ACCEPTED' ? 'bg-blue-100' :
                            emergency.status === 'IN_PROGRESS' ? 'bg-purple-100' : 'bg-yellow-100'
                          }`}>
                            {emergency.status === 'RESOLVED' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            ) : emergency.status === 'ACCEPTED' || emergency.status === 'IN_PROGRESS' ? (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {emergency.description.animalType || 'Unknown'} Emergency
                          </h4>
                          <p className="text-xs text-gray-500">{formatDate(emergency.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeColor(emergency.status)}`}>
                        {emergency.status}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Description</h5>
                        <p className="text-gray-800">{emergency.description.mainDescription || 'No description provided'}</p>
                        {emergency.description.animalCount > 1 && (
                          <div className="mt-2 inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                            {emergency.description.animalCount} animals reported
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Response</h5>
                        {emergency.responses && emergency.responses.length > 0 ? (
                          <div className="bg-blue-50 rounded-md p-3">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-blue-800">{emergency.responses[0].ngo?.name || 'HopeOps Central'}</p>
                              </div>
                            </div>
                            <p className="text-blue-700">{emergency.responses[0].notes || 'No details provided'}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-md p-3 text-gray-500 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            No response yet
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {emergency.location && (
                      <div className="px-4 pb-4">
                        <a 
                          href={`https://maps.google.com/?q=${emergency.location.lat},${emergency.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary flex items-center hover:underline"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          View location on map
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <UserDonations />
      </div>
    </motion.div>
  );
};

export default Profile;