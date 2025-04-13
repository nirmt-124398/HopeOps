import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAnimals } from '../context/AnimalsContext';
import Input, { TextArea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import UnderDevelopment from '../components/common/UnderDevelopment';

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
  
  const onSubmit = (data) => {
    // In a real app, you would send this data to your backend
    console.log('Adoption form submitted:', data);
    
    // For now, we'll just navigate to a success page
    alert('Thank you for submitting your adoption application! We will contact you soon.');
    navigate('/');
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
      <UnderDevelopment/>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adoption Application</h1>
        <p className="text-gray-600 max-w-3xl">
          Thank you for your interest in adopting an animal from our shelter.
          Please fill out this form completely. The information you provide will help us find the best match for you and the animal.
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
      
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  required
                />
                
                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
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
                  label="Phone Number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  required
                />
                
                <Input
                  label="Address"
                  {...register('address')}
                  error={errors.address?.message}
                  containerClassName="md:col-span-2"
                  required
                />
                
                <Input
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                  required
                />
                
                <Input
                  label="State"
                  {...register('state')}
                  error={errors.state?.message}
                  required
                />
                
                <Input
                  label="Zip Code"
                  {...register('zipCode')}
                  error={errors.zipCode?.message}
                  required
                />
              </div>
            </div>
            
            {/* Housing Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Housing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Housing Type"
                  {...register('housingType')}
                  options={housingOptions}
                  error={errors.housingType?.message}
                  required
                />
                
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you own or rent?
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="own" 
                        {...register('housingStatus')} 
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Own</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="rent" 
                        {...register('housingStatus')} 
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Rent</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pet Experience */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pet Experience</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Have you owned pets before or do you currently have pets?
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="true" 
                        {...register('hasOwnedPetsBefore')} 
                        onChange={() => setValue('hasOwnedPetsBefore', true)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="false" 
                        {...register('hasOwnedPetsBefore')} 
                        onChange={() => setValue('hasOwnedPetsBefore', false)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors.hasOwnedPetsBefore && (
                    <p className="mt-1 text-sm text-red-600">{errors.hasOwnedPetsBefore.message}</p>
                  )}
                </div>
                
                {hasOwnedPetsBefore && (
                  <TextArea
                    label="Tell us about your current pets or past pet experience"
                    {...register('currentPets')}
                    error={errors.currentPets?.message}
                    placeholder="Species, breed, age, how long you've had them, etc."
                    required={hasOwnedPetsBefore}
                    rows={4}
                  />
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Do you have children in your home?
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="true" 
                        {...register('hasChildren')} 
                        onChange={() => setValue('hasChildren', true)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        value="false" 
                        {...register('hasChildren')} 
                        onChange={() => setValue('hasChildren', false)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {errors.hasChildren && (
                    <p className="mt-1 text-sm text-red-600">{errors.hasChildren.message}</p>
                  )}
                </div>
                
                {hasChildren && (
                  <Input
                    label="Ages of children in your home"
                    {...register('childrenAges')}
                    error={errors.childrenAges?.message}
                    required={hasChildren}
                  />
                )}
                
                <Input
                  label="What is your typical work schedule?"
                  {...register('workSchedule')}
                  error={errors.workSchedule?.message}
                  placeholder="E.g., Monday-Friday 9am-5pm, work from home, etc."
                  required
                />
                
                <Select
                  label="Your activity level"
                  {...register('activityLevel')}
                  options={activityOptions}
                  error={errors.activityLevel?.message}
                  required
                />
                
                <TextArea
                  label="Why do you want to adopt this animal?"
                  {...register('whyAdopt')}
                  error={errors.whyAdopt?.message}
                  placeholder="Please tell us why you're interested in adopting and what you're looking for in a pet."
                  required
                  rows={5}
                />
              </div>
            </div>
            
            {/* Agreement */}
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    {...register('agreeTerms')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-gray-500">
                    I certify that all information provided is true and accurate. I understand that submitting this application does not guarantee adoption.
                  </p>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submission */}
            <div className="flex justify-between">
              <Link to="/animals">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button variant="primary" type="submit">Submit Application</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdoptionForm; 