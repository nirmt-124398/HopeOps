import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apifile';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RescueCompleted = () => {
  const [completedRescues, setCompletedRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRescue, setSelectedRescue] = useState(null);

  useEffect(() => {
    fetchCompletedRescues();
  }, []);

  const fetchCompletedRescues = async () => {
    try {
      setLoading(true);
      // This endpoint should return emergencies that the current NGO has resolved
      const response = await apiRequest.get('/emergencies?status=RESOLVED');
      
      // Filter for emergencies that have a response from the current NGO
      const myNgoRescues = response.data.filter(emergency => 
        emergency.responses && 
        emergency.responses.length > 0 && 
        emergency.responses.some(r => r.status === 'RESOLVED')
      );
      
      setCompletedRescues(myNgoRescues);
      setError(null);
    } catch (err) {
      console.error('Error fetching completed rescues:', err);
      setError('Failed to load completed rescue operations. Please try again.');
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

  const viewRescueDetails = (rescue) => {
    setSelectedRescue(rescue);
  };

  const closeRescueDetails = () => {
    setSelectedRescue(null);
  };

  // Calculate the time taken to complete the rescue
  const calculateTimeTaken = (rescue) => {
    if (!rescue.responses || rescue.responses.length === 0) return 'Unknown';
    
    const acceptedTimestamp = new Date(rescue.responses[0].acceptedAt || rescue.responses[0].createdAt).getTime();
    const resolvedTimestamp = rescue.responses
      .find(r => r.status === 'RESOLVED')?.updatedAt || rescue.updatedAt;
    
    if (!resolvedTimestamp) return 'Unknown';
    
    const resolvedTime = new Date(resolvedTimestamp).getTime();
    const timeDiff = resolvedTime - acceptedTimestamp;
    
    // Calculate hours, minutes
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hr${hours % 24 !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Completed Rescue Operations</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={fetchCompletedRescues}
          >
            Retry
          </Button>
        </div>
      )}
      
      {selectedRescue ? (
        <Card className="mb-6">
          <CardBody>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Rescue Details</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={closeRescueDetails}
              >
                Back to List
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Emergency Information</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <p><strong>Reporter:</strong> {selectedRescue.user?.username || 'Anonymous'}</p>
                  <p><strong>Animal Type:</strong> {selectedRescue.description?.animalType || 'Not specified'}</p>
                  <p><strong>Animal Count:</strong> {selectedRescue.description?.animalCount || '1'}</p>
                  <p><strong>Description:</strong> {selectedRescue.description?.mainDescription}</p>
                  <p><strong>Urgency Level:</strong> {selectedRescue.description?.urgencyLevel || 'Not specified'}</p>
                  <p><strong>Reported:</strong> {formatDate(selectedRescue.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rescue Operation</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  {selectedRescue.responses && selectedRescue.responses.length > 0 && (
                    <>
                      <p><strong>Accepted On:</strong> {formatDate(selectedRescue.responses[0].acceptedAt || selectedRescue.responses[0].createdAt)}</p>
                      <p><strong>Completed On:</strong> {formatDate(selectedRescue.responses.find(r => r.status === 'RESOLVED')?.updatedAt || selectedRescue.updatedAt)}</p>
                      <p><strong>Time Taken:</strong> {calculateTimeTaken(selectedRescue)}</p>
                      <p><strong>Notes:</strong> {selectedRescue.responses.find(r => r.status === 'RESOLVED')?.notes || 'No notes provided'}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Location</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>Latitude: {selectedRescue.location?.lat}</p>
                <p>Longitude: {selectedRescue.location?.lng}</p>
                <Button 
                  variant="secondary"
                  className="mt-2"
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedRescue.location?.lat},${selectedRescue.location?.lng}`, '_blank')}
                >
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : completedRescues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You have no completed rescue operations.</p>
          <p className="text-sm text-gray-500">
            When you mark a rescue as resolved, it will appear here.
          </p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => window.location.href = '/ngo-admin/rescue-operations/ongoing'}
          >
            View Ongoing Operations
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedRescues.map((rescue) => (
                <tr key={rescue.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {rescue.description?.animalType || 'Animal'} Emergency
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={rescue.description?.mainDescription}>
                      {rescue.description?.mainDescription || 'No description provided'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rescue.user?.username || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rescue.responses && rescue.responses.length > 0 
                      ? formatDate(rescue.responses[0].acceptedAt || rescue.responses[0].createdAt)
                      : formatDate(rescue.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rescue.responses?.find(r => r.status === 'RESOLVED')?.updatedAt || rescue.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateTimeTaken(rescue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewRescueDetails(rescue)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RescueCompleted;