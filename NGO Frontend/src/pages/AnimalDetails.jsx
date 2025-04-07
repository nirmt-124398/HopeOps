import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAnimals } from '../context/AnimalsContext';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import UnderDevelopment from '../components/common/UnderDevelopment';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnimal, loading } = useAnimals();
  const [animal, setAnimal] = useState(null);
  
  useEffect(() => {
    if (!loading) {
      const foundAnimal = getAnimal(id);
      if (foundAnimal) {
        setAnimal(foundAnimal);
      } else {
        // Animal not found, redirect to animals list
        navigate('/animals');
      }
    }
  }, [id, getAnimal, loading, navigate]);

  if (loading || !animal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Pending Adoption':
        return 'bg-yellow-100 text-yellow-800';
      case 'Adopted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Treatment':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <UnderDevelopment/>
      {/* Back button */}
      <div className="mb-6">
        <Link to="/animals" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Animals
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Image */}
        <div className="lg:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={animal.image || 'https://via.placeholder.com/600x400?text=No+Image'} 
              alt={animal.name} 
              className="w-full h-auto"
            />
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <Button variant="secondary" size="lg" fullWidth>
              <Link to={`/adopt?animalId=${animal.id}`} className="w-full inline-block">
                Adopt {animal.name}
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" fullWidth>
              <a href={`tel:+15551234567`} className="w-full inline-block">
                Call About {animal.name}
              </a>
            </Button>
            
            <Button variant="primary" size="lg" fullWidth>
              <Link to="/donate" className="w-full inline-block">
                Sponsor {animal.name}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{animal.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(animal.adoptionStatus)}`}>
              {animal.adoptionStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Species</h3>
              <p className="text-base font-semibold">{animal.species}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Breed</h3>
              <p className="text-base font-semibold">{animal.breed}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Age</h3>
              <p className="text-base font-semibold">{animal.age} {animal.age === 1 ? 'year' : 'years'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="text-base font-semibold">{animal.gender}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Health Status</h3>
              <p className="text-base font-semibold">{animal.healthStatus}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rescued On</h3>
              <p className="text-base font-semibold">{formatDate(animal.rescueDate)}</p>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About {animal.name}</h2>
            <p className="text-gray-700 leading-relaxed">{animal.description}</p>
          </div>
          
          {/* Characteristics */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Details</h2>
            <ul className="grid grid-cols-2 gap-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Vaccinated: {animal.vaccinationStatus}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Neutered/Spayed: {animal.neutered ? 'Yes' : 'No'}</span>
              </li>
            </ul>
          </div>
          
          {/* Medical History */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Medical History</h2>
            <Card>
              <CardBody className="p-0">
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {animal.medicalRecords.map((record, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.treatment}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails; 