import React, { useState } from 'react';
import { useAnimals } from '../../context/AnimalsContext';
import AnimalCard from './AnimalCard';
import Input from '../ui/Input';
import { Select } from '../ui/Input';

const AnimalList = () => {
  const { animals, loading, error } = useAnimals();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    species: '',
    adoptionStatus: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const filteredAnimals = animals.filter((animal) => {
    // Filter by search term
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by species
    const matchesSpecies = filters.species === '' || animal.species === filters.species;
    
    // Filter by status
    const matchesStatus = filters.adoptionStatus === '' || animal.adoptionStatus === filters.adoptionStatus;
    
    return matchesSearch && matchesSpecies && matchesStatus;
  });

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

  const speciesOptions = [
    { value: '', label: 'All Species' },
    { value: 'Dog', label: 'Dogs' },
    { value: 'Cat', label: 'Cats' },
    { value: 'Bird', label: 'Birds' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Available', label: 'Available' },
    { value: 'Pending Adoption', label: 'Pending Adoption' },
    { value: 'Adopted', label: 'Adopted' },
    { value: 'Under Treatment', label: 'Under Treatment' },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name, breed, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
            options={speciesOptions}
          />
          
          <Select
            name="adoptionStatus"
            value={filters.adoptionStatus}
            onChange={handleFilterChange}
            options={statusOptions}
          />
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredAnimals.length} of {animals.length} animals
        </p>
      </div>
      
      {/* Animal grid */}
      {filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-md text-center">
          <p className="text-gray-600">No animals found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default AnimalList; 