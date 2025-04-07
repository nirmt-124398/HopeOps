import React from 'react';
import AnimalListComponent from '../components/animals/AnimalList';
import UnderDevelopment from '../components/common/UnderDevelopment';

const AnimalListPage = () => {
  return (
    <div>
      <div className="mb-8">
      <UnderDevelopment/>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adopt a Pet</h1>
        <p className="text-gray-600 max-w-3xl">
          Browse our animals looking for their forever homes. Use the filters to find your perfect companion.
          When you find an animal you're interested in, you can view more details or apply to adopt.
        </p>
      </div>
      
      <AnimalListComponent />
    </div>
  );
};

export default AnimalListPage; 