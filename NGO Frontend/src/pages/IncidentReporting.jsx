import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Card, { CardBody } from '../components/ui/Card';
import Input, { TextArea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import apiRequest from '../utils/apifile';

// Update the schema to include the new fields
const schema = yup.object().shape({
  description: yup.string().required('Description is required').min(10, 'Please provide more details'),
  animalType: yup.string().required('Animal type is required'),
  urgencyLevel: yup.string().required('Urgency level is required'),
  animalCount: yup.number().positive('Number must be positive').integer('Must be a whole number').required('Number of animals is required'),
});

// Basic error class for custom error handling
class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{this.state.error?.message || "Unknown error"}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const IncidentReporting = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  // Get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your current location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);
  
  const onSubmit = async (data) => {
    if (!userLocation) {
      setSubmitError("Location is required to report an emergency");
      return;
    }

    setLoading(true);
    setSubmitError(null);
    
    try {
      // Prepare request data with structured description
      const emergencyData = {
        location: userLocation,
        description: {
          mainDescription: data.description,
          animalType: data.animalType,
          urgencyLevel: data.urgencyLevel,
          animalCount: data.animalCount
        }
      };
      
      // Make API request without authentication
      const response = await apiRequest.post('/emergencies', emergencyData);
      
      // Handle successful response
      console.log('Emergency reported:', response.data);
      setSubmitted(true);
      
      // Redirect to home after short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error("Error reporting emergency:", error);
      const errorMessage = error.response?.data?.error || "Failed to report emergency. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Define options for dropdown selects
  const animalTypeOptions = [
    { value: '', label: 'Select animal type...' },
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'other', label: 'Other' },
  ];
  
  const urgencyOptions = [
    { value: 'low', label: 'Low - Animal appears healthy but needs help' },
    { value: 'medium', label: 'Medium - Animal needs attention soon' },
    { value: 'high', label: 'High - Animal is injured or in immediate danger' },
    { value: 'critical', label: 'Critical - Life-threatening emergency' },
  ];

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-16">
        <Card>
          <CardBody className="text-center py-8">
            <div className="mb-4 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Reported!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this emergency. Our team has been notified and will respond as quickly as possible.
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report an Emergency</h1>
        <p className="text-gray-600 max-w-3xl">
          Use this form to report an emergency situation. Your current location will be automatically 
          included with the report to help our team respond quickly.
        </p>
      </div>
      
      <Card>
        <CardBody>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p>{submitError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Location Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
              
              {loading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Getting your location...</span>
                  </div>
                </div>
              )}
              
              {locationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{locationError}</p>
                  <p className="mt-2 text-sm">Please enable location services in your browser to continue.</p>
                </div>
              )}
              
              {userLocation && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="font-medium">Location detected successfully</p>
                  <p className="text-sm mt-1">
                    Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            
            {/* Animal Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Animal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Animal Type"
                  {...register('animalType')}
                  options={animalTypeOptions}
                  error={errors.animalType?.message}
                  required
                />
                
                <Input
                  label="Number of Animals"
                  type="number"
                  min="1"
                  defaultValue="1"
                  {...register('animalCount')}
                  error={errors.animalCount?.message}
                />
                
                <Select
                  label="Urgency Level"
                  {...register('urgencyLevel')}
                  options={urgencyOptions}
                  error={errors.urgencyLevel?.message}
                  required
                  containerClassName="md:col-span-2"
                />
              </div>
            </div>
            
            {/* Emergency Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Emergency Details</h2>
              
              <div>
                <TextArea
                  label="Description"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="Please describe the emergency situation in detail"
                  required
                  rows={4}
                />
              </div>
            </div>
            
            {/* Submission */}
            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate('/')}>Cancel</Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !userLocation}
              >
                {loading ? 'Submitting...' : 'Report Emergency'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

// Wrap the component with our custom error handler
const IncidentReportingWithErrorHandler = () => {
  return (
    <ErrorHandler>
      <IncidentReporting />
    </ErrorHandler>
  );
};

export default IncidentReportingWithErrorHandler;