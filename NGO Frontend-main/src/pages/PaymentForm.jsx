import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import UnderDevelopment from '../components/common/UnderDevelopment';

// Form validation schema
const schema = yup.object().shape({
  cardNumber: yup.string()
    .required('Card number is required')
    .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
  cardName: yup.string().required('Name on card is required'),
  expiryMonth: yup.string()
    .required('Expiry month is required')
    .matches(/^(0[1-9]|1[0-2])$/, 'Must be a valid month (01-12)'),
  expiryYear: yup.string()
    .required('Expiry year is required')
    .matches(/^[0-9]{2}$/, 'Must be a 2-digit year'),
  cvv: yup.string()
    .required('CVV is required')
    .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
});

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    name: '',
    email: '',
    type: 'general',
    recurring: false,
  });
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get the query params from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setPaymentInfo({
      amount: queryParams.get('amount') || 0,
      name: queryParams.get('name') || '',
      email: queryParams.get('email') || '',
      type: queryParams.get('type') || 'general',
      recurring: queryParams.get('recurring') === 'true',
    });
  }, [location.search]);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const onSubmit = (data) => {
    // In a real app, this would process the payment through a payment gateway
    console.log('Payment form submitted:', { ...data, ...paymentInfo });
    
    // Simulate payment processing
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      
      // Redirect to home after showing success message
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  const getPurposeText = (type) => {
    switch (type) {
      case 'medical':
        return 'Medical Treatment Fund';
      case 'food':
        return 'Food and Supplies Fund';
      case 'shelter':
        return 'Shelter Improvement Fund';
      case 'rescue':
        return 'Rescue Operations Fund';
      default:
        return 'General Support Fund';
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto my-16">
        <Card>
          <CardBody className="text-center py-8">
            <div className="mb-4 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation of ₹{paymentInfo.amount} has been processed successfully.
              A receipt has been sent to your email address.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <UnderDevelopment/>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Donation</h1>
        <p className="text-gray-600">
          Please enter your payment information to complete your donation.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-primary text-white">
          <h2 className="text-xl font-semibold">Donation Summary</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₹{paymentInfo.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donor Name:</span>
              <span className="font-medium">{paymentInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donor Email:</span>
              <span className="font-medium">{paymentInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donation Purpose:</span>
              <span className="font-medium">{getPurposeText(paymentInfo.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Donation Type:</span>
              <span className="font-medium">{paymentInfo.recurring ? 'Recurring' : 'One-time'}</span>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader className="bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Name on Card"
                {...register('cardName')}
                error={errors.cardName?.message}
                required
              />
              
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                {...register('cardNumber')}
                error={errors.cardNumber?.message}
                required
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Expiry Month"
                  placeholder="MM"
                  {...register('expiryMonth')}
                  error={errors.expiryMonth?.message}
                  required
                />
                
                <Input
                  label="Expiry Year"
                  placeholder="YY"
                  {...register('expiryYear')}
                  error={errors.expiryYear?.message}
                  required
                />
                
                <Input
                  label="CVV"
                  placeholder="123"
                  type="password"
                  {...register('cvv')}
                  error={errors.cvv?.message}
                  required
                />
              </div>
            </div>
            
            <div className="mt-8">
              <div className="mb-6 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your payment information is secure and encrypted
                </p>
              </div>
              
              <Button 
                variant="primary" 
                type="submit" 
                fullWidth 
                size="lg"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Donate ₹${paymentInfo.amount}`
                )}
              </Button>
              
              <p className="mt-4 text-center text-sm text-gray-500">
                By clicking the button above, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentForm; 