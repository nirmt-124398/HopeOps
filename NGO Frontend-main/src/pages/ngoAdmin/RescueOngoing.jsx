import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apifile';

const RescueOngoing = () => {
  const [ongoingRescues, setOngoingRescues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOngoingRescues = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/emergencies?status=ACCEPTED');
      
      const myNgoRescues = response.data.filter(emergency => 
        emergency.responses && 
        emergency.responses.length > 0 && 
        emergency.responses.some(r => r.status === 'ACCEPTED')
      );
      
      setOngoingRescues(myNgoRescues);
    } catch (error) {
      console.error('Error fetching ongoing rescues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoingRescues();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Ongoing Rescue Operations</h2>
      <div className="text-center py-8">
        {loading ? (
          <p className="text-gray-600 mb-4">Loading...</p>
        ) : ongoingRescues.length > 0 ? (
          <ul>
            {ongoingRescues.map((rescue, index) => (
              <li key={index} className="text-gray-600 mb-2">
                {rescue.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-4">No ongoing rescue operations.</p>
        )}
        <p className="text-sm text-gray-500">
          This section will display rescue operations that your NGO is currently handling.
          Data will be loaded from /api/emergency/ngo/ongoing
        </p>
      </div>
    </div>
  );
};

export default RescueOngoing;