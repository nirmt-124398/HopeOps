import { createContext, useState, useContext, useEffect } from 'react';
import apiRequest from '../utils/apifile'; // Using the centralized API request module
import { mockAnimals } from '../utils/mockData';

// Create the context
const AnimalsContext = createContext();

// Custom hook to use the animals context
export const useAnimals = () => useContext(AnimalsContext);

// Provider component
export const AnimalsProvider = ({ children }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, fetch animals from API
    // For now, load mock data because the backend isn't ready
    const fetchAnimals = async () => {
      try {
        // Attempt to fetch from API first
        // If it fails, fall back to mock data
        try {
          // This endpoint doesn't exist yet, so it will trigger the catch block
          const response = await apiRequest.get('/animals');
          setAnimals(response.data);
        } catch (apiError) {
          console.log('API not available, using mock data instead');
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setAnimals(mockAnimals);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch animals');
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Add a new animal
  const addAnimal = (animalData) => {
    const newAnimal = {
      id: Date.now().toString(),
      ...animalData,
      createdAt: new Date().toISOString()
    };
    setAnimals([newAnimal, ...animals]);
    return newAnimal;
  };

  // Update an existing animal
  const updateAnimal = (id, updatedData) => {
    setAnimals(
      animals.map(animal => 
        animal.id === id ? { ...animal, ...updatedData } : animal
      )
    );
    return animals.find(animal => animal.id === id);
  };

  // Delete an animal
  const deleteAnimal = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  // Get a single animal by ID
  const getAnimal = (id) => {
    return animals.find(animal => animal.id === id) || null;
  };

  // Context value
  const contextValue = {
    animals,
    loading,
    error,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimal
  };

  return (
    <AnimalsContext.Provider value={contextValue}>
      {children}
    </AnimalsContext.Provider>
  );
};

export default AnimalsContext;