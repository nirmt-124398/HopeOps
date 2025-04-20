import React, { useState, useEffect } from 'react';
import apiRequest from '../../utils/apifile.js';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch donations for the NGO admin
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get('/donations/admin');
      setDonations(response.data);
      
      // Calculate total donations amount
      const total = response.data.reduce((sum, donation) => 
        donation.status === 'COMPLETED' ? sum + donation.amount : sum, 0);
      setTotalAmount(total);
      setError(null);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load donation data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDonations();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle cleanup of stale donations
  const handleCleanupStaleDonations = async () => {
    if (window.confirm('This will mark all pending donations older than 24 hours as expired. Continue?')) {
      try {
        setLoading(true);
        await apiRequest.post('/donations/cleanup');
        // Refresh donation list after cleanup
        fetchDonations();
      } catch (error) {
        console.error('Error cleaning up donations:', error);
        setError('Failed to clean up stale donations. Please try again.');
        setLoading(false);
      }
    }
  };

  // Filter donations by status
  const filteredDonations = statusFilter === 'ALL' 
    ? donations 
    : donations.filter(d => d.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          onClick={() => fetchDonations()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Donation Management</h1>
      
      {/* Status filter */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-md ${statusFilter === 'ALL' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1 rounded-md ${statusFilter === 'COMPLETED' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1 rounded-md ${statusFilter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1 rounded-md ${statusFilter === 'EXPIRED' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
          >
            Expired
          </button>
        </div>
      </div>
      
      {/* Donation summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="text-lg text-gray-600 font-medium">Total Donations</h3>
              <p className="text-3xl font-bold text-primary mt-2">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="text-lg text-gray-600 font-medium">Completed Donations</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {donations.filter(d => d.status === 'COMPLETED').length}
              </p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="text-lg text-gray-600 font-medium">Pending Donations</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {donations.filter(d => d.status === 'PENDING').length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Donations list */}
      <Card>
        <CardBody className="p-0">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No donations {statusFilter !== 'ALL' ? `with status "${statusFilter}"` : ''} have been received yet.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.donorName || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500">{donation.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₹{donation.amount}</div>
                      <div className="text-xs text-gray-500">{donation.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.paymentId === 'pending' ? 
                        <span className="italic text-gray-400">Pending</span> : 
                        <span className="font-mono">{donation.paymentId}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
      
      {/* Add a button to clean up stale donations */}
      <div className="mt-6">
        <Button 
          variant="secondary" 
          onClick={handleCleanupStaleDonations}
        >
          Clean Up Stale Pending Donations
        </Button>
      </div>
    </div>
  );
};

export default DonationManagement;
