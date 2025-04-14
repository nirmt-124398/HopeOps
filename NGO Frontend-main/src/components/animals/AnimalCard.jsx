import React from 'react';
import { Link } from "react-router-dom";
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';

const AnimalCard = ({ animal }) => {
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
    <Card className="h-full transition-transform hover:-translate-y-1 duration-300" hoverable>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={animal.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={animal.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(animal.adoptionStatus)}`}>
            {animal.adoptionStatus}
          </span>
        </div>
      </div>
      
      <CardBody>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{animal.name}</h3>
            <p className="text-sm text-gray-600">{animal.breed}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium">{animal.species}</span>
            <p className="text-sm text-gray-600">{animal.age} {animal.age === 1 ? 'year' : 'years'}</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium">{animal.gender}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Health:</span>
            <span className="font-medium">{animal.healthStatus}</span>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{animal.description}</p>
        
        <div className="mt-4 flex justify-between">
          <Link to={`/animals/${animal.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
          
          {animal.adoptionStatus === 'Available' && (
            <Link to={`/adopt?animalId=${animal.id}`}>
              <Button variant="secondary" size="sm">Adopt Me</Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default AnimalCard; 