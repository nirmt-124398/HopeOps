import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input, { Select, TextArea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import UnderDevelopment from '../components/common/UnderDevelopment';

// Form validation schema
const schema = yup.object().shape({
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  donorName: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  donationType: yup.string().required('Please select donation type'),
  paymentMethod: yup.string().required('Please select payment method'),
  isRecurring: yup.boolean(),
  frequency: yup.string().when('isRecurring', {
    is: true,
    then: yup.string().required('Please select frequency for recurring donation')
  }),
});

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 50,
      donationType: 'general',
      paymentMethod: 'card',
      isRecurring: false,
      frequency: 'monthly'
    }
  });
  
  // Watch for values that affect conditional fields
  const isRecurring = watch('isRecurring');
  
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setValue('amount', amount);
  };
  
  const handleCustomAmount = (e) => {
    setIsCustomAmount(true);
    setSelectedAmount(0);
    setValue('amount', e.target.value ? parseFloat(e.target.value) : '');
  };
  
  const onSubmit = (data) => {
    // In a real app, you would redirect to payment gateway
    console.log('Donation form submitted:', data);
    
    // Redirect to the payment form page
    window.location.href = `/payment?amount=${data.amount}&name=${data.donorName}&email=${data.email}&type=${data.donationType}&recurring=${data.isRecurring}`;
  };

  const donationTypeOptions = [
    { value: 'general', label: 'General Support' },
    { value: 'medical', label: 'Medical Treatment' },
    { value: 'food', label: 'Food and Supplies' },
    { value: 'shelter', label: 'Shelter Improvements' },
    { value: 'rescue', label: 'Rescue Operations' },
  ];
  
  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
  ];

  return (
    <div>
      <UnderDevelopment/>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Our Mission</h1>
        <p className="text-gray-600 max-w-3xl">
          Your generous donation helps us rescue, rehabilitate, and rehome animals in need.
          Every contribution, no matter the size, makes a difference in the lives of these animals.
        </p>
      </div>
      
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
              
              <div className="mt-8 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Giving</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Consider making a recurring monthly donation to provide consistent support to our animal care programs.
                </p>
                <Link to="#recurring-donation" onClick={() => setValue('isRecurring', true)}>
                  <Button variant="secondary" size="sm" className="w-full">Become a Monthly Donor</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Right column - Donation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
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
                    
                    <Input
                      label="Phone (Optional)"
                      {...register('phone')}
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
                    
                    <div id="recurring-donation">
                      <div className="flex items-start mb-4">
                        <div className="flex items-center h-5">
                          <input
                            id="isRecurring"
                            type="checkbox"
                            {...register('isRecurring')}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="isRecurring" className="font-medium text-gray-700">
                            Make this a recurring donation
                          </label>
                          <p className="text-gray-500">
                            Your donation will be automatically processed on a regular basis
                          </p>
                        </div>
                      </div>
                      
                      {isRecurring && (
                        <Select
                          label="Frequency"
                          {...register('frequency')}
                          options={frequencyOptions}
                          error={errors.frequency?.message}
                          required={isRecurring}
                        />
                      )}
                    </div>
                    
                    <TextArea
                      label="Comment (Optional)"
                      {...register('comment')}
                      placeholder="Leave a message or dedication with your donation"
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* Payment Method Selection - will be handled on the next page */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label className={`
                      flex items-center justify-center p-4 border rounded-md cursor-pointer
                      ${watch('paymentMethod') === 'card' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
                    `}>
                      <input
                        type="radio"
                        value="card"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-4 border rounded-md cursor-pointer
                      ${watch('paymentMethod') === 'upi' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
                    `}>
                      <input
                        type="radio"
                        value="upi"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <span>UPI</span>
                    </label>
                    
                    <label className={`
                      flex items-center justify-center p-4 border rounded-md cursor-pointer
                      ${watch('paymentMethod') === 'netbanking' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
                    `}>
                      <input
                        type="radio"
                        value="netbanking"
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <span>Net Banking</span>
                    </label>
                  </div>
                  
                  {errors.paymentMethod && (
                    <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                  )}
                </div>
                
                {/* Submission */}
                <div className="pt-4">
                  <Button variant="primary" type="submit" size="lg" fullWidth>
                    Donate ₹{watch('amount') || 0}
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