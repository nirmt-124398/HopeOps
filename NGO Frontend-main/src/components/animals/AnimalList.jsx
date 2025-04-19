import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { useAnimals } from '../../context/AnimalsContext';

// Define fallback image as a data URL to avoid network requests
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";

const AnimalCard = ({ animal }) => {
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADOPTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="relative">
        {animal.photos && animal.photos.length > 0 ? (
          <img 
            src={animal.photos[0]} 
            alt={animal.name} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No photo available</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(animal.status)}`}>
            {animal.status}
          </span>
        </div>
      </div>
      <CardBody className="flex-1">
        <h3 className="text-lg font-bold text-gray-800">{animal.name}</h3>
        <div className="text-sm text-gray-600 mb-2">
          {animal.species} • {animal.age} year{animal.age !== 1 ? 's' : ''}
        </div>
        <p className="text-gray-700 mb-4 line-clamp-3">{animal.description}</p>
        <div className="mt-auto">
          <Link to={`/animal/${animal.id}`}>
            <Button variant="primary" fullWidth>View Details</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

const AnimalList = () => {
  const { animals, loading, error } = useAnimals();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {animals.length} animals
        </p>
      </div>
      
      {/* Animal grid */}
      {animals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-md text-center">
          <p className="text-gray-600">No animals found.</p>
        </div>
      )}
    </div>
  );
};

export default AnimalList;