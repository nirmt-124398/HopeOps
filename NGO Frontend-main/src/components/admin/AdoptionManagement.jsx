import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apifile.js';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdoptionManagement = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(null);

  // Fetch adoption requests for the NGO
  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get('/adoptions/ngo-requests');
        setAdoptionRequests(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching adoption requests:', err);
        setError('Failed to load adoption requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionRequests();
  }, []);

  // Handle status update (approval/rejection)
  const handleUpdateStatus = async (requestId, status) => {
    try {
      setProcessingRequest(requestId);
      await apiRequest.put(`/adoptions/request/${requestId}`, { status });
      
      // Update local state
      setAdoptionRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status, animal: { 
                ...request.animal, 
                status: status === 'APPROVED' ? 'ADOPTED' : request.animal.status 
              }}
            : request
        )
      );
    } catch (err) {
      console.error(`Error ${status.toLowerCase()}ing adoption request:`, err);
      alert(`Failed to ${status.toLowerCase()} adoption request. Please try again.`);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Get status badge color
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading adoption requests...</p>
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Adoption Requests</h1>
      
      {adoptionRequests.length === 0 ? (
        <Card>
          <CardBody className="text-center p-8">
            <p className="text-gray-500">No adoption requests to display.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adoptionRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.animal.name}
                      {request.animal.photos && request.animal.photos.length > 0 && (
                        <img 
                          src={request.animal.photos[0]} 
                          alt={request.animal.name}
                          className="h-10 w-10 rounded-full object-cover mt-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";
                          }}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.animal.species}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.user.username}
                      <div className="text-xs text-gray-400">{request.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'PENDING' ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                            disabled={processingRequest === request.id}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                            disabled={processingRequest === request.id}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AdoptionManagement;
