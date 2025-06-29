import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAnimals } from '../context/AnimalsContext';
import Input, { TextArea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import apiRequest from '../utils/apifile.js';
import { trackEvent, trackUserInteraction } from '../utils/gtm';

// Form validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  housingType: yup.string().required('Housing type is required'),
  hasOwnedPetsBefore: yup.boolean().required('Please answer this question'),
  currentPets: yup.string().when('hasOwnedPetsBefore', {
    is: true,
    then: yup.string().required('Please provide details about your current pets')
  }),
  hasChildren: yup.boolean().required('Please answer this question'),
  childrenAges: yup.string().when('hasChildren', {
    is: true,
    then: yup.string().required('Please provide ages of children')
  }),
  workSchedule: yup.string().required('Work schedule is required'),
  activityLevel: yup.string().required('Activity level is required'),
  whyAdopt: yup.string().required('Please tell us why you want to adopt'),
  agreeTerms: yup.boolean().oneOf([true], 'You must agree to the terms').required()
});

const AdoptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { animals, loading } = useAnimals();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [adoptionSuccess, setAdoptionSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userAdoptionRequests, setUserAdoptionRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Get the animalId from URL query string
  const queryParams = new URLSearchParams(location.search);
  const animalId = queryParams.get('animalId');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      hasOwnedPetsBefore: false,
      hasChildren: false,
      agreeTerms: false
    }
  });

  // Watch for values that affect conditional fields
  const hasOwnedPetsBefore = watch('hasOwnedPetsBefore');
  const hasChildren = watch('hasChildren');

  // Set the selected animal when animalId is in the URL
  useEffect(() => {
    if (!loading && animalId) {
      const animal = animals.find(a => a.id === animalId);
      if (animal) {
        setSelectedAnimal(animal);
      }
    }
  }, [animalId, animals, loading]);

  // Fetch user's adoption requests
  useEffect(() => {
    const fetchUserAdoptionRequests = async () => {
      setLoadingRequests(true);
      try {
        const response = await apiRequest.get('/adoptions/user-requests');
        setUserAdoptionRequests(response.data);
      } catch (err) {
        console.error('Error fetching adoption requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchUserAdoptionRequests();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');

    try {
      // Track adoption request initiation
      trackUserInteraction('adoption_request_initiated', {
        animal_id: animalId,
        animal_name: selectedAnimal?.name || 'unknown',
        animal_type: selectedAnimal?.type || 'unknown',
        animal_breed: selectedAnimal?.breed || 'unknown',
        applicant_housing_type: data.housingType,
        has_previous_pets: data.hasOwnedPetsBefore,
        has_children: data.hasChildren,
        timestamp: new Date().toISOString()
      });

      // Submit adoption request
      await apiRequest.post('/adoptions/request', {
        animalId: animalId
      });

      // Track successful adoption request submission
      trackUserInteraction('adoption_request_completed', {
        animal_id: animalId,
        animal_name: selectedAnimal?.name || 'unknown',
        animal_type: selectedAnimal?.type || 'unknown',
        timestamp: new Date().toISOString()
      });

      setAdoptionSuccess(true);
      // Refetch adoption requests to update the list
      const response = await apiRequest.get('/adoptions/user-requests');
      setUserAdoptionRequests(response.data);

      // For demo purposes, alert instead of navigate
      alert('Thank you for submitting your adoption application! We will contact you soon.');
    } catch (err) {
      console.error('Error submitting adoption request:', err);
      
      // Track adoption request failure
      trackEvent('adoption_request_failed', 'adoption_error', 'submission_error', animalId);
      
      setError(err.response?.data?.error || 'Failed to submit adoption request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const housingOptions = [
    { value: '', label: 'Select housing type...' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'mobile', label: 'Mobile Home' },
    { value: 'other', label: 'Other' }
  ];

  const activityOptions = [
    { value: '', label: 'Select activity level...' },
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'moderate', label: 'Moderately Active' },
    { value: 'active', label: 'Very Active' },
    { value: 'athletic', label: 'Athletic' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adoption's</h1>
        <p className="text-gray-600">
          Thank you for your interest in adopting an animal from shelter's.
        </p>
      </div>

      {selectedAnimal && (
        <Card className="mb-8">
          <CardHeader className="bg-primary text-white">
            <h2 className="text-xl font-semibold">Selected Animal: {selectedAnimal.name}</h2>
          </CardHeader>
          <CardBody className="flex items-center space-x-4">
            <img 
              src={selectedAnimal.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
              alt={selectedAnimal.name} 
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <p>
                <span className="font-medium">Species:</span> {selectedAnimal.species}
              </p>
              <p>
                <span className="font-medium">Breed:</span> {selectedAnimal.breed}
              </p>
              <p>
                <span className="font-medium">Age:</span> {selectedAnimal.age} {selectedAnimal.age === 1 ? 'year' : 'years'}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      

      {/* Show existing adoption requests */}
      {userAdoptionRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Adoption Requests</h2>
          <Card>
            <CardBody className="p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NGO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAdoptionRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.animal.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.animal.species}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.animal.ngo.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : request.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdoptionForm;