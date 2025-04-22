import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnimals } from '../context/AnimalsContext';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { TextArea, Select } from '../components/ui/Input';
import apiRequest from '../utils/apifile.js';
import AdoptionManagement from '../components/admin/AdoptionManagement';
import DonationManagement from '../components/admin/DonationManagement';

// Define a fallback image as a data URL to avoid network requests
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";

// Admin Dashboard Layout
const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!user || !isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const getActiveClass = (path) => {
    return location.pathname === `/admin${path}` 
      ? 'bg-primary text-white' 
      : 'text-gray-600 hover:bg-gray-100';
  };

  if (!user || !isAdmin()) {
    return <div>Unauthorized. Redirecting...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 md:min-h-screen bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>
        
        <nav className="p-2">
          <ul>
            <li className="mb-1">
              <Link 
                to="/admin" 
                className={`block px-4 py-2 rounded ${getActiveClass('')}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/animals" 
                className={`block px-4 py-2 rounded ${getActiveClass('/animals')}`}
              >
                Animals
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/adoptions" 
                className={`block px-4 py-2 rounded ${getActiveClass('/adoptions')}`}
              >
                Adoption Requests
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/incidents" 
                className={`block px-4 py-2 rounded ${getActiveClass('/incidents')}`}
              >
                Incident Reports
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/donations" 
                className={`block px-4 py-2 rounded ${getActiveClass('/donations')}`}
              >
                Donations
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/animals" element={<AdminAnimals />} />
          <Route path="/adoptions" element={<AdminAdoptions />} />
          <Route path="/incidents" element={<AdminIncidents />} />
          <Route path="/donations" element={<AdminDonations />} />
        </Routes>
      </div>
    </div>
  );
};

// Admin Overview Page
const AdminOverview = () => {
  const { animals } = useAnimals();
  const { user } = useAuth();
  
  const [ngoData, setNgoData] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for NGO update form
  const [isEditingNGO, setIsEditingNGO] = useState(false);
  const [ngoFormData, setNgoFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
    phone: '',
    address: '',
    website: '',
    logo: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Initialize form data when ngoData changes
  useEffect(() => {
    if (ngoData) {
      setNgoFormData({
        name: ngoData.ngo.name || '',
        description: ngoData.ngo.description || '',
        contactEmail: ngoData.ngo.contactEmail || '',
        phone: ngoData.ngo.phone || '',
        address: ngoData.ngo.address || '',
        website: ngoData.ngo.website || '',
        logo: ngoData.ngo.logo || '',
        socialMedia: {
          facebook: ngoData.ngo.socialMedia?.facebook || '',
          twitter: ngoData.ngo.socialMedia?.twitter || '',
          instagram: ngoData.ngo.socialMedia?.instagram || '',
          linkedin: ngoData.ngo.socialMedia?.linkedin || '',
          youtube: ngoData.ngo.socialMedia?.youtube || ''
        }
      });
    }
  }, [ngoData]);

  // Handle input change for NGO form
  const handleNgoInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNgoFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNgoFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit NGO update
  const handleNgoUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      
      // Validate data before sending to backend
      const errors = [];
      
      // Validate phone number (must be exactly 10 digits)
      if (ngoFormData.phone && !/^\d{10}$/.test(ngoFormData.phone)) {
        errors.push("Phone number must be exactly 10 digits");
      }
      
      // Validate address (minimum 10 characters)
      if (ngoFormData.address && ngoFormData.address.length < 10) {
        errors.push("Address must be at least 10 characters long");
      }
      
      // Validate website URL
      if (ngoFormData.website && !isValidURL(ngoFormData.website)) {
        errors.push("Website must be a valid URL (e.g., https://example.com)");
      }
      
      // Validate logo URL
      if (ngoFormData.logo && !isValidURL(ngoFormData.logo)) {
        errors.push("Logo must be a valid URL");
      }
      
      // Validate social media URLs
      Object.entries(ngoFormData.socialMedia || {}).forEach(([platform, url]) => {
        if (url && !isValidURL(url)) {
          errors.push(`${platform} link must be a valid URL`);
        }
      });
      
      // If validation errors, display them and stop submission
      if (errors.length > 0) {
        setUpdateError(`Please fix the following issues:\n${errors.join('\n')}`);
        return;
      }
      
      // Make sure we have all the required fields set correctly
      const updateData = {
        name: ngoFormData.name,
        description: ngoFormData.description,
        contactEmail: ngoFormData.contactEmail,
        phone: ngoFormData.phone,
        address: ngoFormData.address,
        website: ngoFormData.website,
        logo: ngoFormData.logo,
        socialMedia: ngoFormData.socialMedia
      };
      
      console.log("Sending NGO update data:", updateData);
      
      // API call to update NGO info - use the NGO ID from the state
      await apiRequest.put(`/ngos/${ngoData.ngo.id}`, updateData);
      
      // Update local ngoData state
      setNgoData(prev => ({
        ...prev,
        ngo: {
          ...prev.ngo,
          ...updateData
        }
      }));
      
      setUpdateSuccess(true);
      setIsEditingNGO(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating NGO:', err);
      
      // Display specific validation errors from the backend if available
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors.map(
          e => `${e.field}: ${e.message}`
        ).join('\n');
        setUpdateError(`Validation errors:\n${backendErrors}`);
      } else {
        setUpdateError(`Failed to update NGO information. ${err.response?.data?.message || 'Please try again.'}`);
      }
    }
  };
  
  // Helper function to validate URLs
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Fetch all data needed for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Instead of fetching NGO dashboard data, fetch other data first
        const adoptionsPromise = apiRequest.get('/adoptions/ngo-requests')
          .catch(err => {
            console.error('Error fetching adoptions:', err);
            return { data: [] };
          });
          
        const emergenciesPromise = apiRequest.get('/emergencies')
          .catch(err => {
            console.error('Error fetching emergencies:', err);
            return { data: [] };
          });
          
        const donationsPromise = apiRequest.get('/donations/admin')
          .catch(err => {
            console.error('Error fetching donations:', err);
            return { data: [] };
          });
        
        // Wait for all requests to complete
        const [adoptionsResponse, emergenciesResponse, donationsResponse] = 
          await Promise.all([adoptionsPromise, emergenciesPromise, donationsPromise]);
        
        setAdoptionRequests(adoptionsResponse.data);
        setEmergencies(emergenciesResponse.data);
        setDonations(donationsResponse.data);
        
        // Try to fetch NGO info if other data is loaded successfully
        try {
          const ngoAdminResponse = await apiRequest.get('/ngos/dashboard'); // This API returns comprehensive NGO data
          
          if (ngoAdminResponse.data) {
            // The API now returns a complete NGO object with all details directly
            const ngo = ngoAdminResponse.data;
            setNgoData({
              ngo: {
                id: ngo.id,
                name: ngo.name,
                description: ngo.description,
                contactEmail: ngo.contactEmail,
                phone: ngo.phone,
                logo: ngo.logo,
                address: ngo.address,
                website: ngo.website,
                socialMedia: ngo.socialMedia || {}
              }
            });
            
            // We can also update the animals data if needed, since it's included in the response
            if (ngo.animals && Array.isArray(ngo.animals)) {
              // Update the animals context only if we need to
              // This is optional since we're already fetching animals separately
            }
          }
        } catch (ngoErr) {
          console.error('Error fetching NGO data:', ngoErr);
          // Don't set error state since we already have other data
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Calculate stats
  const pendingAdoptions = adoptionRequests.filter(req => req.status === 'PENDING').length;
  
  // Filter open incidents - only count those assigned to this NGO (has a response from current NGO)
  const openIncidents = emergencies.filter(emergency => {
    // Check if the emergency has responses
    if (!emergency.responses || emergency.responses.length === 0) {
      return false; // Not assigned to any NGO
    }
    
    // Check if any response is from this NGO (we're showing incidents we're responsible for)
    const hasNGOResponse = emergency.responses.some(response => {
      // Include if the status is not 'RESOLVED' - meaning it's still open
      return response.status !== 'RESOLVED';
    });
    
    // Include only if it has a response from current NGO and is not resolved
    return hasNGOResponse && emergency.status !== 'RESOLVED';
  }).length;
  
  const totalDonationsAmount = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.amount, 0);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const stats = [
    { 
      title: 'Animals', 
      value: animals.length, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      title: 'Pending Adoptions', 
      value: pendingAdoptions, 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    { 
      title: 'Open Incidents', 
      value: openIncidents, 
      color: 'bg-red-100 text-red-800' 
    },
    { 
      title: 'Total Donations', 
      value: formatCurrency(totalDonationsAmount), 
      color: 'bg-purple-100 text-purple-800' 
    },
  ];

  // Handle redirects for quick actions
  const navigate = useNavigate();
  
  const handleAddAnimal = () => {
    navigate('/admin/animals');
  };
  
  const handleProcessAdoption = () => {
    navigate('/admin/adoptions');
  };
  
  const handleRespondIncident = () => {
    navigate('/admin/incidents');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* NGO Information */}
      {ngoData && (
        <Card className="mb-8">
          <CardBody>
            {!isEditingNGO ? (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    {ngoData.ngo.logo && (
                      <img 
                        src={ngoData.ngo.logo} 
                        alt={ngoData.ngo.name} 
                        className="h-20 w-20 rounded-full object-cover mr-6"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{ngoData.ngo.name}</h2>
                      <p className="text-gray-600 mb-4 max-w-2xl">{ngoData.ngo.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h3>
                          <div className="space-y-2">
                            <p className="flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium mr-1">Email:</span> {ngoData.ngo.contactEmail}
                            </p>
                            <p className="flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="font-medium mr-1">Phone:</span> {ngoData.ngo.phone || 'Not provided'}
                            </p>
                            <p className="flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium mr-1">Address:</span> {ngoData.ngo.address || 'Not provided'}
                            </p>
                            {ngoData.ngo.website && (
                              <p className="flex items-center text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <span className="font-medium mr-1">Website:</span>
                                <a href={ngoData.ngo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {ngoData.ngo.website}
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          {/* Subscription Details */}
                          {ngoData.subscription && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Subscription Details</h3>
                              <div className="bg-gray-50 rounded-md p-3">
                                <div className="flex items-center mb-2">
                                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                                    {ngoData.subscription.status}
                                  </div>
                                  <p className="text-gray-700 text-sm font-medium">
                                    {ngoData.subscription.plan?.name || 'Standard Plan'}
                                  </p>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Valid Until:</span>{' '}
                                  {ngoData.subscription.endDate ? new Date(ngoData.subscription.endDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Social Media Links - Fixed to always display if NGO data exists */}
                          <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Social Media</h3>
                            {ngoData.ngo.socialMedia && 
                            Object.values(ngoData.ngo.socialMedia || {}).some(value => value) ? (
                              <div className="flex space-x-3">
                                {ngoData.ngo.socialMedia?.facebook && (
                                  <a href={ngoData.ngo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                  </a>
                                )}
                                {ngoData.ngo.socialMedia?.twitter && (
                                  <a href={ngoData.ngo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                  </a>
                                )}
                                {ngoData.ngo.socialMedia?.instagram && (
                                  <a href={ngoData.ngo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 3.997-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-3.997-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                  </a>
                                )}
                                {ngoData.ngo.socialMedia?.linkedin && (
                                  <a href={ngoData.ngo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                                    </svg>
                                  </a>
                                )}
                                {ngoData.ngo.socialMedia?.youtube && (
                                  <a href={ngoData.ngo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                    <span className="sr-only">YouTube</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No social media links available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingNGO(true)}
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit NGO Details
                  </Button>
                </div>
                
                {/* Success message */}
                {updateSuccess && (
                  <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-md text-sm">
                    NGO information updated successfully!
                  </div>
                )}
              </>
            ) : (
              /* Edit form */
              <div className="animate-fadeIn">
                <h3 className="text-lg font-bold mb-4">Edit NGO Information</h3>
                
                {updateError && (
                  <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {updateError}
                  </div>
                )}
                
                <form onSubmit={handleNgoUpdateSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NGO Name
                      </label>
                      <Input
                        name="name"
                        value={ngoFormData.name}
                        onChange={handleNgoInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo URL
                      </label>
                      <Input
                        name="logo"
                        value={ngoFormData.logo}
                        onChange={handleNgoInputChange}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <TextArea
                        name="description"
                        value={ngoFormData.description}
                        onChange={handleNgoInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <Input
                        name="contactEmail"
                        type="email"
                        value={ngoFormData.contactEmail}
                        onChange={handleNgoInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        value={ngoFormData.phone}
                        onChange={handleNgoInputChange}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <TextArea
                        name="address"
                        value={ngoFormData.address}
                        onChange={handleNgoInputChange}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <Input
                        name="website"
                        value={ngoFormData.website}
                        onChange={handleNgoInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Social Media Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook
                        </label>
                        <Input
                          name="socialMedia.facebook"
                          value={ngoFormData.socialMedia.facebook}
                          onChange={handleNgoInputChange}
                          placeholder="https://facebook.com/yourpage"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter
                        </label>
                        <Input
                          name="socialMedia.twitter"
                          value={ngoFormData.socialMedia.twitter}
                          onChange={handleNgoInputChange}
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <Input
                          name="socialMedia.instagram"
                          value={ngoFormData.socialMedia.instagram}
                          onChange={handleNgoInputChange}
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <Input
                          name="socialMedia.linkedin"
                          value={ngoFormData.socialMedia.linkedin}
                          onChange={handleNgoInputChange}
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube
                        </label>
                        <Input
                          name="socialMedia.youtube"
                          value={ngoFormData.socialMedia.youtube}
                          onChange={handleNgoInputChange}
                          placeholder="https://youtube.com/c/yourchannel"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsEditingNGO(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="primary"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            
          </CardBody>
        </Card>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="text-center">
              <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
              <p className={`text-2xl font-bold mt-2 ${stat.color} py-1 px-2 rounded-full inline-block`}>
                {stat.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" onClick={handleAddAnimal}>
            Add New Animal
          </Button>
          <Button variant="secondary" onClick={handleProcessAdoption}>
            Process Adoption Request
          </Button>
          <Button variant="accent" onClick={handleRespondIncident}>
            Respond to Incident
          </Button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <Card>
          <CardBody className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Recent Adoptions */}
                {adoptionRequests.slice(0, 2).map(request => (
                  <tr key={`adoption-${request.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Adoption application for {request.animal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : request.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Recent Emergencies */}
                {emergencies.slice(0, 2).map(emergency => (
                  <tr key={`emergency-${emergency.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(emergency.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Emergency report: {emergency.description?.animalType || 'Animal'} {emergency.description?.mainDescription?.substring(0, 30)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${emergency.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : emergency.status === 'ACCEPTED' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'}`}>
                        {emergency.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Recent Donations */}
                {donations.slice(0, 1).map(donation => (
                  <tr key={`donation-${donation.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Donation received: {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${donation.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : donation.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'}`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Show message if no activities */}
                {adoptionRequests.length === 0 && emergencies.length === 0 && donations.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent activities to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Animal Management Component
const AdminAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuth();
  
  // Fetch animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        // Using the apiRequest utility instead of direct axios calls
        const response = await apiRequest.get("/animals");
        
        if (Array.isArray(response.data)) {
          setAnimals(response.data);
        } else {
          setAnimals([]);
          setError('Received invalid data format from server.');
        }
      } catch (err) {
        setError('Failed to load animals. Please try again.');
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Handle add new animal
  const handleAddAnimal = async (formData) => {
    try {
      const response = await apiRequest.post(
        "/animals",
        formData
      );
      setAnimals(prev => [...prev, response.data]);
      setShowAddModal(false);
    } catch (err) {
      alert('Failed to add animal. Please try again.');
    }
  };

  // Handle update animal
  const handleUpdateAnimal = async (formData) => {
    try {
      const response = await apiRequest.put(
        `/animals/${currentAnimal.id}`,
        formData
      );
      setAnimals(prev => prev.map(animal => 
        animal.id === currentAnimal.id ? response.data : animal
      ));
      setShowEditModal(false);
      setCurrentAnimal(null);
    } catch (err) {
      alert('Failed to update animal. Please try again.');
    }
  };

  // Handle delete animal
  const handleDeleteAnimal = async (id) => {
    try {
      await apiRequest.delete(`/animals/${id}`);
      setAnimals(prev => prev.filter(animal => animal.id !== id));
      setDeleteConfirmation(null);
    } catch (err) {
      alert('Failed to delete animal. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Animals</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
        >
          Add New Animal
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p>Loading animals...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {!animals || animals.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No animals added yet</h3>
              <p className="text-gray-500 mb-4">Add your first animal to start managing adoptions</p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
              >
                Add First Animal
              </Button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(animals) && animals.map((animal) => (
                    <tr key={animal.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {animal.photos && animal.photos.length > 0 ? (
                          <img 
                            src={animal.photos[0]} 
                            alt={animal.name} 
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite error loop
                              e.target.src = fallbackImage;
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No photo</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.species}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.age} year{animal.age !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={animal.description}>
                          {animal.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${animal.status === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : animal.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'}`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentAnimal(animal);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(animal.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Animal Modal */}
      {showAddModal && (
        <AnimalFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAnimal}
          title="Add New Animal"
        />
      )}

      {/* Edit Animal Modal */}
      {showEditModal && currentAnimal && (
        <AnimalFormModal
          onClose={() => {
            setShowEditModal(false);
            setCurrentAnimal(null);
          }}
          onSubmit={handleUpdateAnimal}
          title="Edit Animal"
          animal={currentAnimal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this animal? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteAnimal(deleteConfirmation)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Animal Form Modal Component
const AnimalFormModal = ({ onClose, onSubmit, title, animal = null }) => {
  const [formData, setFormData] = useState({
    name: animal?.name || '',
    species: animal?.species || 'DOG',
    age: animal?.age || 1,
    description: animal?.description || '',
    photos: animal?.photos || []
  });
  const [photoUrl, setPhotoUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) : value
    }));
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl.trim()]
      }));
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const speciesOptions = [
    { value: 'DOG', label: 'Dog' },
    { value: 'CAT', label: 'Cat' },
    { value: 'COW', label: 'Cow' },
    { value: 'BIRD', label: 'Bird' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter animal name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species <span className="text-red-500">*</span>
            </label>
            <Select
              name="species"
              value={formData.species}
              onChange={handleChange}
              options={speciesOptions}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (years) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Enter description of the animal, including details about temperament, history, etc."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos
            </label>
            
            <div className="flex mb-2">
              <Input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Enter photo URL"
                className="flex-1 mr-2"
              />
              <Button 
                type="button"
                variant="secondary"
                onClick={handleAddPhoto}
              >
                Add
              </Button>
            </div>
            
            {formData.photos.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-2">Added Photos:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo ${index+1}`}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.src = fallbackImage;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
            >
              {animal ? 'Update' : 'Add'} Animal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder components for other admin sections
const AdminAdoptions = () => (
  <AdoptionManagement />
);

const AdminIncidents = () => {
  const [pendingEmergencies, setPendingEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [respondingEmergency, setRespondingEmergency] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEmergencies();
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const fetchAllEmergencies = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/emergencies');
      setPendingEmergencies(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load emergency reports. Please try again.');
    } finally {
      setLoading(false);
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
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewEmergencyDetails = (emergency) => {
    setSelectedEmergency(emergency);
  };

  const closeEmergencyDetails = () => {
    setSelectedEmergency(null);
  };

  // New functions to handle emergency response
  const handleRespond = (emergency) => {
    setRespondingEmergency(emergency);
    setResponseText(`We are dispatching a rescue team to help the ${emergency.description?.animalType || 'animal'}.`);
  };

  const cancelResponse = () => {
    setRespondingEmergency(null);
    setResponseText('');
  };

  const submitResponse = async () => {
    if (!respondingEmergency || !responseText) return;

    try {
      setSubmitting(true);
      
      // Step 1: Send the initial response
      const responseData = {
        status: "ACCEPTED",
        notes: responseText
      };
      
      const response = await apiRequest.post(`/emergencies/${respondingEmergency.id}/respond`, responseData);
      
      if (response.data) {
        // Show success message
        setSuccessMessage('Emergency response submitted successfully. The rescue operation has been initiated.');
        
        // Update the local state to reflect the change
        setPendingEmergencies(prevEmergencies => 
          prevEmergencies.map(emergency => 
            emergency.id === respondingEmergency.id 
              ? {
                  ...emergency,
                  status: 'ACCEPTED',
                  responses: [
                    {
                      id: response.data.response.id,
                      status: 'ACCEPTED',
                      notes: responseText,
                      ngo: response.data.response.ngo,
                      createdAt: new Date().toISOString(),
                      acceptedAt: new Date().toISOString()
                    },
                    ...(emergency.responses || [])
                  ]
                }
              : emergency
          )
        );
        
        // Reset the form
        setRespondingEmergency(null);
        setResponseText('');
        
        // Refresh data after a short delay
        setTimeout(() => {
          fetchAllEmergencies();
        }, 1000);
      }
    } catch (err) {
      setError('Failed to respond to emergency. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to check if an emergency has been responded to
  const hasResponse = (emergency) => {
    return emergency.responses && emergency.responses.length > 0;
  };

  // Updated function to get NGO name without debug logs
  const getResponseNGOName = (emergency) => {
    if (!hasResponse(emergency)) return 'No response yet';
    
    const response = emergency.responses[0];
    
    // If we have the ngo object with name, use it
    if (response.ngo?.name) {
      return response.ngo.name;
    } 
    
    // If we only have ngoId but no ngo object, use a placeholder
    if (response.ngoId) {
      return `NGO (ID: ${response.ngoId.substring(0, 8)}...)`;
    }
    
    // Default fallback
    return 'HopeOps Central';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Incident Reports</h1>
      <p className="mb-6">Track and respond to reported animal incidents.</p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={fetchAllEmergencies}
          >
            Retry
          </Button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Response Form */}
      {respondingEmergency && (
        <Card className="mb-6">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Respond to Emergency</h3>
            
            <div className="mb-4">
              <p><strong>Reporter:</strong> {respondingEmergency.user?.username || 'Anonymous'}</p>
              <p><strong>Animal Type:</strong> {respondingEmergency.description?.animalType || 'Not specified'}</p>
              <p><strong>Description:</strong> {respondingEmergency.description?.mainDescription}</p>
              <p><strong>Location:</strong> Lat: {respondingEmergency.location?.lat}, Lng: {respondingEmergency.location?.lng}</p>
              <p><strong>Reported:</strong> {formatDate(respondingEmergency.createdAt)}</p>
            </div>
            
            <TextArea
              label="Response Message"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={4}
              required
              placeholder="Explain how you will help with this emergency"
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                variant="outline" 
                onClick={cancelResponse}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={submitResponse}
                disabled={submitting || !responseText}
              >
                {submitting ? 'Submitting...' : 'Send Response'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
      
      {/* Emergency Details View */}
      {selectedEmergency && !respondingEmergency && (
        <Card className="mb-6">
          <CardBody>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Emergency Details</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={closeEmergencyDetails}
              >
                Back to List
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Emergency Information</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <p><strong>Reporter:</strong> {selectedEmergency.user?.username || 'Anonymous'}</p>
                  <p><strong>Animal Type:</strong> {selectedEmergency.description?.animalType || 'Not specified'}</p>
                  <p><strong>Animal Count:</strong> {selectedEmergency.description?.animalCount || '1'}</p>
                  <p><strong>Description:</strong> {selectedEmergency.description?.mainDescription}</p>
                  <p><strong>Urgency Level:</strong> {selectedEmergency.description?.urgencyLevel || 'Not specified'}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedEmergency.status)}`}>
                      {selectedEmergency.status}
                    </span>
                  </p>
                  <p><strong>Reported:</strong> {formatDate(selectedEmergency.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Response Information</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  {hasResponse(selectedEmergency) ? (
                    <>
                      <p><strong>Responding NGO:</strong> {getResponseNGOName(selectedEmergency)}</p>
                      <p><strong>Response Status:</strong> 
                        <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedEmergency.responses[0].status)}`}>
                          {selectedEmergency.responses[0].status}
                        </span>
                      </p>
                      <p><strong>Accepted On:</strong> {selectedEmergency.responses[0].acceptedAt ? formatDate(selectedEmergency.responses[0].acceptedAt) : 'Not yet accepted'}</p>
                      <p><strong>Notes:</strong> {selectedEmergency.responses[0].notes || 'No notes provided'}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">No NGO has responded to this emergency yet.</p>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          setSelectedEmergency(null);
                          handleRespond(selectedEmergency);
                        }}
                      >
                        Respond to This Emergency
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Location</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>Latitude: {selectedEmergency.location?.lat}</p>
                <p>Longitude: {selectedEmergency.location?.lng}</p>
                <Button 
                  variant="secondary"
                  className="mt-2"
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedEmergency.location?.lat},${selectedEmergency.location?.lng}`, '_blank')}
                >
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
      
      {/* Emergency List */}
      {!selectedEmergency && !respondingEmergency && (
        <>
          {pendingEmergencies.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No emergency reports</h3>
              <p className="text-gray-500">There are currently no emergency reports in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NGO Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingEmergencies.map((emergency) => (
                    <tr key={emergency.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emergency.user?.username || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emergency.description?.animalType || 'Not specified'}
                        {emergency.description?.animalCount > 1 && (
                          <div className="text-xs text-gray-500">Count: {emergency.description.animalCount}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                        <div className="truncate" title={emergency.description?.mainDescription}>
                          {emergency.description?.mainDescription || 'No description provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(emergency.status)}`}>
                          {emergency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(emergency.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getResponseNGOName(emergency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewEmergencyDetails(emergency)}
                          >
                            View
                          </Button>
                          
                          {!hasResponse(emergency) && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRespond(emergency)}
                            >
                              Respond
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AdminDonations = () => (
  <DonationManagement />
);

export default AdminDashboard;