import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input, { Select, TextArea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import apiRequest from '../utils/apifile.js';
import { useAuth } from '../context/AuthContext';
import { trackEvent, trackUserInteraction } from '../utils/gtm';

// Form validation schema
const schema = yup.object().shape({
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  donorName: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  donationType: yup.string().required('Please select donation type'),
  comment: yup.string().optional(),
});

const DonationPage = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 50,
      donorName: user?.username || '',
      email: user?.email || '',
      donationType: 'general',
      comment: ''
    }
  });
  
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setValue('amount', amount);
    
    // Track donation amount selection
    trackEvent('donation_amount_selected', 'donation', `preset_${amount}`, amount);
  };
  
  const handleCustomAmount = (e) => {
    setIsCustomAmount(true);
    setSelectedAmount(0);
    const customValue = e.target.value ? parseFloat(e.target.value) : '';
    setValue('amount', customValue);
    
    // Track custom amount entry
    if (customValue) {
      trackEvent('donation_amount_selected', 'donation', 'custom_amount', customValue);
    }
  };
  
  const onSubmit = async (data) => {
    
    try {
      setLoading(true);
      setError(null);
      
      // Track donation initiation
      trackUserInteraction('donation_initiated', {
        amount: data.amount,
        donation_type: data.donationType,
        user_type: user ? 'logged_in' : 'guest'
      });
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Step 1: Create Razorpay order
      const orderResponse = await apiRequest.post('/donations/order', {
        donationAmount: data.amount,
        donorName: data.donorName,
        email: data.email,
        purpose: data.donationType,
        comment: data.comment
      }, { 
        headers,
        withCredentials: true 
      });
      
      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount, // amount is already in paise
        currency: orderResponse.data.currency,
        name: "HopeOps NGO Platform",
        description: `${data.donationType.charAt(0).toUpperCase() + data.donationType.slice(1)} Donation`,
        order_id: orderResponse.data.order_id,
        prefill: {
          name: data.donorName,
          email: data.email
        },
        handler: async function(response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await apiRequest.post('/donations/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              withCredentials: true
            });
            
            // Track successful donation completion
            trackUserInteraction('donation_completed', {
              amount: data.amount,
              donation_type: data.donationType,
              payment_method: 'razorpay',
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              user_type: user ? 'logged_in' : 'guest',
              timestamp: new Date().toISOString()
            });
            
            // Reset loading state
            setLoading(false);
            
            // Show success message
            alert('Thank you for your donation! Your contribution will help our mission.');
            
            // Redirect to donation history page for logged in users or homepage for guests
            if (user) {
              navigate('/my-donations');
            } else {
              navigate('/');
            }
            
          } catch (err) {
            console.error('Payment verification failed:', err);
            
            // Track payment verification failure
            trackEvent('donation_verification_failed', 'donation_error', 'payment_verification', data.amount);
            
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            // Track payment modal dismissal
            trackEvent('donation_modal_dismissed', 'donation_abandonment', 'payment_cancelled', data.amount);
            setLoading(false);
          },
          escape: false,
          confirm_close: true
        },
        theme: {
          color: "#3B82F6" // Using tailwind primary blue color
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error('Error initiating donation:', err);
      
      // Track donation initiation failure
      trackEvent('donation_initiation_failed', 'donation_error', 'api_error', data.amount);
      
      setError(err.response?.data?.error || 'Failed to process donation. Please try again.');
      setLoading(false);
    }
  };

  const donationTypeOptions = [
    { value: 'general', label: 'General Support' },
    { value: 'medical', label: 'Medical Treatment' },
    { value: 'food', label: 'Food and Supplies' },
    { value: 'shelter', label: 'Shelter Improvements' },
    { value: 'rescue', label: 'Rescue Operations' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Our Mission</h1>
        <p className="text-gray-600">
          Your generous donation helps us rescue, rehabilitate, and rehome animals in need.
          Every contribution, no matter the size, makes a difference in the lives of these animals.
        </p>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Impact Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="bg-primary text-white">
              <h2 className="text-xl font-semibold">Your Impact</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">₹50</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Provides food for one animal for a week
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">₹100</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Covers basic medical checkup for one animal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">₹500</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Provides complete vaccination for one animal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">₹1000</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Sponsors full care of one animal for a month
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Right column - Donation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Amount</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[50, 100, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`
                          py-2 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary
                          ${selectedAmount === amount && !isCustomAmount 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
                        `}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Custom Amount"
                      type="number"
                      placeholder="Enter custom amount"
                      {...register('amount')}
                      onChange={handleCustomAmount}
                      error={errors.amount?.message}
                      required
                    />
                  </div>
                </div>
                
                {/* Donor Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Your Information</h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      {...register('donorName')}
                      error={errors.donorName?.message}
                      required
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                    />
                  </div>
                </div>
                
                {/* Donation Type */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Details</h2>
                  
                  <div className="space-y-4">
                    <Select
                      label="Donation Purpose"
                      {...register('donationType')}
                      options={donationTypeOptions}
                      error={errors.donationType?.message}
                      required
                    />
                    
                    <TextArea
                      label="Comment (Optional)"
                      {...register('comment')}
                      placeholder="Leave a message or dedication with your donation"
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* Submission */}
                <div className="pt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : `Donate ₹${watch('amount') || 0}`}
                  </Button>
                  
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    By proceeding, you'll be redirected to our secure payment gateway to complete your donation.
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;