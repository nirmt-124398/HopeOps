import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnimals } from '../context/AnimalsContext';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockVolunteers, mockAdoptions, mockIncidents, mockDonations } from '../utils/mockData';

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
                to="/admin/volunteers" 
                className={`block px-4 py-2 rounded ${getActiveClass('/volunteers')}`}
              >
                Volunteers
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
          <Route path="/volunteers" element={<AdminVolunteers />} />
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
    { title: 'Active Volunteers', value: mockVolunteers.length, color: 'bg-green-100 text-green-800' },
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

// Placeholder components for other admin sections
const AdminAnimals = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Animals</h1>
    <p>View, add, edit, and delete animals from the system.</p>
  </div>
);

const AdminAdoptions = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Adoption Requests</h1>
    <p>Process and manage adoption applications.</p>
  </div>
);

const AdminVolunteers = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Volunteers</h1>
    <p>View and manage volunteer information and schedules.</p>
  </div>
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