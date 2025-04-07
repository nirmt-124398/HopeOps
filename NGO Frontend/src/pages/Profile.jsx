import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../utils/apifile';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

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
        
        // Handle rate limiting specifically
        if (error.response?.status === 429) {
          alert('Too many requests. Please wait a moment before trying again.');
        }
        
        setLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      
      // Only include password field if user is changing password
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }
      
      // Problem: Not sending updateData in the request
      const response = await apiRequest.put('/user/profile', updateData);
      
      updateUser(response.data);
      
      // Reset password fields after successful update
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Card className="p-6 mb-6">
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
    </div>
  );
};

export default Profile;