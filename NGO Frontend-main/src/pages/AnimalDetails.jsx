import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAnimals } from '../context/AnimalsContext';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../utils/apifile.js';

// Define a fallback image as a data URL to avoid network requests
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";

const AnimalDetails = () => {
  const { id } = useParams();
  const { animals, loading } = useAnimals();
  const [animal, setAnimal] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [hasRequestedThisAnimal, setHasRequestedThisAnimal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  // Find the animal in the context
  useEffect(() => {
    const foundAnimal = animals.find(a => a.id === id);
    if (foundAnimal) {
      setAnimal(foundAnimal);
    } else if (!loading) {
      // If not found in context, fetch directly
      const fetchAnimal = async () => {
        try {
          const response = await apiRequest.get(`/animals/${id}`);
          setAnimal(response.data);
        } catch (err) {
          console.error('Error fetching animal:', err);
          setError('Failed to load animal details.');
        }
      };
      
      fetchAnimal();
    }
  }, [id, animals, loading]);

  // Fetch user's adoption requests
  useEffect(() => {
    if (user) {
      const fetchUserRequests = async () => {
        try {
          const response = await apiRequest.get('/adoptions/user-requests');
          setAdoptionRequests(response.data);
          
          // Check if user has already requested this animal
          const request = response.data.find(req => req.animalId === id);
          if (request) {
            setHasRequestedThisAnimal(true);
            setCurrentRequest(request);
          }
        } catch (err) {
          console.error('Error fetching adoption requests:', err);
        }
      };
      
      fetchUserRequests();
    }
  }, [user, id]);

  const handleAdoptionRequest = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/animal/${id}` } });
      return;
    }

    setRequesting(true);
    setError('');

    try {
      const response = await apiRequest.post('/adoptions/request', { animalId: id });
      setHasRequestedThisAnimal(true);
      setCurrentRequest(response.data);
      
      // Refresh animal data to get updated status
      const animalResponse = await apiRequest.get(`/animals/${id}`);
      setAnimal(animalResponse.data);
      
      alert('Your adoption request has been submitted successfully!');
    } catch (err) {
      console.error('Error submitting adoption request:', err);
      setError(err.response?.data?.error || 'Failed to submit adoption request. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !animal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADOPTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdoptButtonState = () => {
    if (hasRequestedThisAnimal && currentRequest) {
      if (currentRequest.status === 'PENDING') {
        return { text: 'Request Pending', disabled: true };
      } else if (currentRequest.status === 'APPROVED') {
        return { text: 'Adoption Approved!', disabled: true };
      } else if (currentRequest.status === 'REJECTED') {
        return { text: 'Request Rejected', disabled: true };
      }
    }
    
    if (animal.status !== 'AVAILABLE') {
      return { text: 'Not Available', disabled: true };
    }
    
    return { text: `Adopt ${animal.name}`, disabled: false };
  };

  return (
    <div>      
      {/* Back button */}
      <div className="mb-6">
        <Link to="/animals" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Animals
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Image and Actions */}
        <div className="lg:col-span-1">
          {animal.photos && animal.photos.length > 0 ? (
            <img 
              src={animal.photos[0]} 
              alt={animal.name} 
              className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg shadow-md mb-6 flex items-center justify-center">
              <span className="text-gray-500">No photo available</span>
            </div>
          )}
          
          <div className="mt-6 flex flex-col space-y-4">
            {/* Adoption request button */}
            <Button 
              variant="secondary" 
              size="lg" 
              fullWidth
              onClick={handleAdoptionRequest}
              disabled={requesting || getAdoptButtonState().disabled}
            >
              {requesting ? 'Processing...' : getAdoptButtonState().text}
            </Button>
            
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {/* Display adoption status if there's a request */}
            {hasRequestedThisAnimal && currentRequest && (
              <div className={`p-3 rounded-md 
                ${currentRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  currentRequest.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                <p className="font-medium">
                  {currentRequest.status === 'PENDING' ? 'Your adoption request is pending approval.' : 
                   currentRequest.status === 'APPROVED' ? 'Your adoption request has been approved!' :
                   'Your adoption request was rejected.'}
                </p>
                <p className="text-sm mt-1">
                  Requested on: {new Date(currentRequest.requestedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <Button variant="outline" size="lg" fullWidth>
              <a href={`tel:${animal.ngo?.phone || '+1234567890'}`} className="w-full inline-block">
                Call About {animal.name}
              </a>
            </Button>
            
            <Button variant="primary" size="lg" fullWidth>
              <Link to="/donate" className="w-full inline-block">
                Sponsor {animal.name}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{animal.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(animal.status)}`}>
              {animal.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Species</h3>
              <p className="text-base font-semibold">{animal.species}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Age</h3>
              <p className="text-base font-semibold">{animal.age} {animal.age === 1 ? 'year' : 'years'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Added On</h3>
              <p className="text-base font-semibold">{formatDate(animal.createdAt)}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">About {animal.name}</h2>
            <p className="text-gray-700">{animal.description}</p>
          </div>
          
          {animal.ngo && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">NGO Information</h2>
              <Card>
                <CardBody>
                  <div className="flex items-center">
                    {animal.ngo.logo ? (
                      <img 
                        src={animal.ngo.logo} 
                        alt={animal.ngo.name} 
                        className="h-16 w-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImage;
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                        <span className="text-xl font-bold">{animal.ngo.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{animal.ngo.name}</h3>
                      {animal.ngo.contactEmail && <p className="text-gray-600">{animal.ngo.contactEmail}</p>}
                      {animal.ngo.phone && <p className="text-gray-600">{animal.ngo.phone}</p>}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;