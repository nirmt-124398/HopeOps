import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnimals } from '../context/AnimalsContext';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockAdoptions, mockIncidents, mockDonations } from '../utils/mockData';
import Input, { TextArea, Select } from '../components/ui/Input';
import apiRequest from '../utils/apifile.js';
import AdoptionManagement from '../components/admin/AdoptionManagement';

// Define a fallback image as a data URL to avoid network requests
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M40,35 C35.5817,35 32,38.5817 32,43 C32,47.4183 35.5817,51 40,51 C44.4183,51 48,47.4183 48,43 C48,38.5817 44.4183,35 40,35 Z M25,33 L35,33 L35,30 L45,30 L45,33 L55,33 C56.6568,33 58,34.3432 58,36 L58,64 C58,65.6568 56.6568,67 55,67 L25,67 C23.3432,67 22,65.6568 22,64 L22,36 C22,34.3432 23.3432,33 25,33 Z' fill='%23666666'/%3E%3C/svg%3E";

// Admin Dashboard Layout
const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!user || !isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const getActiveClass = (path) => {
    return location.pathname === `/admin${path}` 
      ? 'bg-primary text-white' 
      : 'text-gray-600 hover:bg-gray-100';
  };

  if (!user || !isAdmin()) {
    return <div>Unauthorized. Redirecting...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 md:min-h-screen bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
        </div>
        
        <nav className="p-2">
          <ul>
            <li className="mb-1">
              <Link 
                to="/admin" 
                className={`block px-4 py-2 rounded ${getActiveClass('')}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/animals" 
                className={`block px-4 py-2 rounded ${getActiveClass('/animals')}`}
              >
                Animals
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/adoptions" 
                className={`block px-4 py-2 rounded ${getActiveClass('/adoptions')}`}
              >
                Adoption Requests
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/incidents" 
                className={`block px-4 py-2 rounded ${getActiveClass('/incidents')}`}
              >
                Incident Reports
              </Link>
            </li>
            <li className="mb-1">
              <Link 
                to="/admin/donations" 
                className={`block px-4 py-2 rounded ${getActiveClass('/donations')}`}
              >
                Donations
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/animals" element={<AdminAnimals />} />
          <Route path="/adoptions" element={<AdminAdoptions />} />
          <Route path="/incidents" element={<AdminIncidents />} />
          <Route path="/donations" element={<AdminDonations />} />
        </Routes>
      </div>
    </div>
  );
};

// Admin Overview Page
const AdminOverview = () => {
  const { animals } = useAnimals();
  
  const stats = [
    { title: 'Animals', value: animals.length, color: 'bg-blue-100 text-blue-800' },
    { title: 'Pending Adoptions', value: mockAdoptions.length, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Open Incidents', value: mockIncidents.filter(i => i.status !== 'Resolved').length, color: 'bg-red-100 text-red-800' },
    { title: 'Total Donations', value: `₹${mockDonations.reduce((sum, d) => sum + d.amount, 0)}`, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="text-center">
              <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
              <p className={`text-2xl font-bold mt-2 ${stat.color} py-1 px-2 rounded-full inline-block`}>
                {stat.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" onClick={() => alert('Add new animal')}>
            Add New Animal
          </Button>
          <Button variant="secondary" onClick={() => alert('Process adoption')}>
            Process Adoption Request
          </Button>
          <Button variant="accent" onClick={() => alert('Respond to incident')}>
            Respond to Incident
          </Button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <Card>
          <CardBody className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 8, 2023</td>
                  <td className="px-6 py-4 text-sm text-gray-500">New animal rescue (Rocky, Dog)</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 7, 2023</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Adoption application for Luna</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 5, 2023</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Medical treatment for Max</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// Animal Management Component
const AdminAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuth();
  
  // Fetch animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        // Using the apiRequest utility instead of direct axios calls
        const response = await apiRequest.get("/animals");
        
        if (Array.isArray(response.data)) {
          setAnimals(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setAnimals([]);
          setError('Received invalid data format from server.');
        }
      } catch (err) {
        console.error('Error fetching animals:', err);
        setError('Failed to load animals. Please try again.');
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Handle add new animal
  const handleAddAnimal = async (formData) => {
    try {
      const response = await apiRequest.post(
        "/animals",
        formData
      );
      setAnimals(prev => [...prev, response.data]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding animal:', err);
      alert('Failed to add animal. Please try again.');
    }
  };

  // Handle update animal
  const handleUpdateAnimal = async (formData) => {
    try {
      const response = await apiRequest.put(
        `/animals/${currentAnimal.id}`,
        formData
      );
      setAnimals(prev => prev.map(animal => 
        animal.id === currentAnimal.id ? response.data : animal
      ));
      setShowEditModal(false);
      setCurrentAnimal(null);
    } catch (err) {
      console.error('Error updating animal:', err);
      alert('Failed to update animal. Please try again.');
    }
  };

  // Handle delete animal
  const handleDeleteAnimal = async (id) => {
    try {
      await apiRequest.delete(`/animals/${id}`);
      setAnimals(prev => prev.filter(animal => animal.id !== id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting animal:', err);
      alert('Failed to delete animal. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Animals</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
        >
          Add New Animal
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p>Loading animals...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {!animals || animals.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No animals added yet</h3>
              <p className="text-gray-500 mb-4">Add your first animal to start managing adoptions</p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
              >
                Add First Animal
              </Button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(animals) && animals.map((animal) => (
                    <tr key={animal.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {animal.photos && animal.photos.length > 0 ? (
                          <img 
                            src={animal.photos[0]} 
                            alt={animal.name} 
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite error loop
                              e.target.src = fallbackImage;
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No photo</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.species}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {animal.age} year{animal.age !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={animal.description}>
                          {animal.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${animal.status === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : animal.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'}`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentAnimal(animal);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(animal.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Animal Modal */}
      {showAddModal && (
        <AnimalFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAnimal}
          title="Add New Animal"
        />
      )}

      {/* Edit Animal Modal */}
      {showEditModal && currentAnimal && (
        <AnimalFormModal
          onClose={() => {
            setShowEditModal(false);
            setCurrentAnimal(null);
          }}
          onSubmit={handleUpdateAnimal}
          title="Edit Animal"
          animal={currentAnimal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this animal? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteAnimal(deleteConfirmation)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Animal Form Modal Component
const AnimalFormModal = ({ onClose, onSubmit, title, animal = null }) => {
  const [formData, setFormData] = useState({
    name: animal?.name || '',
    species: animal?.species || 'DOG',
    age: animal?.age || 1,
    description: animal?.description || '',
    photos: animal?.photos || []
  });
  const [photoUrl, setPhotoUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) : value
    }));
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl.trim()]
      }));
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const speciesOptions = [
    { value: 'DOG', label: 'Dog' },
    { value: 'CAT', label: 'Cat' },
    { value: 'COW', label: 'Cow' },
    { value: 'BIRD', label: 'Bird' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter animal name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species <span className="text-red-500">*</span>
            </label>
            <Select
              name="species"
              value={formData.species}
              onChange={handleChange}
              options={speciesOptions}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (years) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Enter description of the animal, including details about temperament, history, etc."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos
            </label>
            
            <div className="flex mb-2">
              <Input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Enter photo URL"
                className="flex-1 mr-2"
              />
              <Button 
                type="button"
                variant="secondary"
                onClick={handleAddPhoto}
              >
                Add
              </Button>
            </div>
            
            {formData.photos.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-2">Added Photos:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo ${index+1}`}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.src = fallbackImage;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
            >
              {animal ? 'Update' : 'Add'} Animal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder components for other admin sections
const AdminAdoptions = () => (
  <AdoptionManagement />
);

const AdminIncidents = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Incident Reports</h1>
    <p>Track and respond to reported animal incidents.</p>
  </div>
);

const AdminDonations = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Donation Management</h1>
    <p>View and track donations received.</p>
  </div>
);

export default AdminDashboard;