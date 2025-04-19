import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiRequest from '../utils/apifile.js';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import UnderDevelopment from '../components/common/UnderDevelopment';
import { useAuth } from '../context/AuthContext';

const UserAdoptionRequests = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserAdoptionRequests = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get('/adoptions/user-requests');
        setAdoptionRequests(response.data);
      } catch (err) {
        console.error('Error fetching adoption requests:', err);
        setError('Failed to load your adoption requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserAdoptionRequests();
    }
  }, [user]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your adoption requests.</p>
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading your adoption requests...</p>
      </div>
    );
  }

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
      <UnderDevelopment/>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Adoption Requests</h1>
      
      {adoptionRequests.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No adoption requests yet</h3>
          <p className="text-gray-500 mb-4">Browse our animals and submit an adoption request</p>
          <Link to="/animals">
            <Button variant="primary">Find Animals</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adoptionRequests.map(request => (
            <Card key={request.id}>
              <CardBody>
                <div className="flex items-start">
                  <div className="h-20 w-20 flex-shrink-0 mr-4">
                    {request.animal.photos && request.animal.photos.length > 0 ? (
                      <img 
                        src={request.animal.photos[0]} 
                        alt={request.animal.name}
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-xs">No photo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold">{request.animal.name}</h3>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{request.animal.species}, {request.animal.age} year{request.animal.age !== 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-600 mt-2">NGO: {request.animal.ngo.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Requested on: {new Date(request.requestedAt).toLocaleDateString()}</p>
                    
                    <div className="mt-4">
                      <Link to={`/animal/${request.animal.id}`}>
                        <Button variant="outline" size="sm">View Animal</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAdoptionRequests;
