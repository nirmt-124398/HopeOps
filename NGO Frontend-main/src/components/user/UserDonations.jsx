import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiRequest from '../../utils/apifile.js';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const UserDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await apiRequest.get('/donations/user', {
          withCredentials: true
        });
        setDonations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load your donation history: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDonations();
  }, [user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const handleRetryPayment = async (donationId) => {
    try {
      setLoading(true);
      const response = await apiRequest.post(`/donations/retry/${donationId}`);
      
      // Open Razorpay checkout with the new order
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "HopeOps NGO Platform",
        description: "Retry Donation Payment",
        order_id: response.data.order_id,
        handler: async function(response) {
          try {
            // Verify payment
            const verifyResponse = await apiRequest.post('/donations/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            // Show success message and refresh donations
            alert('Thank you for your donation! Your payment was successful.');
            fetchUserDonations();
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed. Please try again or contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        theme: {
          color: "#3B82F6"
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error('Error retrying payment:', err);
      setError('Failed to retry payment. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Please log in to see your donations.</p>
        <Link to="/login">
          <Button variant="primary">Login</Button>
        </Link>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
        <Link to="/donate">
          <Button variant="primary">Make a Donation</Button>
        </Link>
      </div>
    );
  }

  const totalDonated = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div>
      <div className="bg-primary bg-opacity-10 p-4 rounded-lg mb-6">
        <p className="text-primary font-medium">
          You've donated a total of <span className="font-bold">₹{totalDonated}</span>. Thank you for your generous support!
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {donations.map(donation => (
          <Card key={donation.id} className="h-full">
            <CardBody>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">₹{donation.amount}</div>
                  <div className="text-sm text-gray-500">{donation.purpose}</div>
                </div>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(donation.status)}`}>
                  {donation.status}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Donated on: {formatDate(donation.createdAt)}</p>
                <p>Payment ID: {donation.paymentId !== 'pending' ? donation.paymentId : 'Processing'}</p>
                {donation.comment && <p className="mt-2 italic">"{donation.comment}"</p>}
              </div>
              
              {/* Add retry button for pending donations */}
              {donation.status === 'PENDING' && (
                <div className="mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleRetryPayment(donation.id)}
                  >
                    Retry Payment
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDonations;
