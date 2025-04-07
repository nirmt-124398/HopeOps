// Mock data for animals
export const mockAnimals = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    description: 'Friendly and energetic golden retriever who loves to play fetch.',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Up to date',
    neutered: true,
    adoptionStatus: 'Available',
    rescueDate: '2023-05-10T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    medicalRecords: [
      { date: '2023-05-12', treatment: 'Initial checkup', notes: 'Healthy, slight dehydration' },
      { date: '2023-06-15', treatment: 'Vaccination', notes: 'DHPP vaccine administered' }
    ]
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    gender: 'Female',
    description: 'Gentle and quiet Siamese cat who loves to cuddle.',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Up to date',
    neutered: true,
    adoptionStatus: 'Available',
    rescueDate: '2023-06-03T10:15:00Z',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFa4-yfH0zPL9wuhDaze0WB5gor4S10tKTog&s',
    medicalRecords: [
      { date: '2023-06-04', treatment: 'Initial checkup', notes: 'Mild ear infection' },
      { date: '2023-06-11', treatment: 'Follow-up', notes: 'Ear infection clearing up' }
    ]
  },
  {
    id: '3',
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 4,
    gender: 'Male',
    description: 'Loyal and protective German Shepherd, good with children and other pets.',
    healthStatus: 'Recovery',
    vaccinationStatus: 'Up to date',
    neutered: true,
    adoptionStatus: 'Under Treatment',
    rescueDate: '2023-04-22T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2VybWFuJTIwc2hlcGhlcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    medicalRecords: [
      { date: '2023-04-23', treatment: 'Emergency care', notes: 'Broken leg from accident' },
      { date: '2023-05-20', treatment: 'Cast removal', notes: 'Healing well, needs physical therapy' }
    ]
  },
  {
    id: '4',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 1,
    gender: 'Male',
    description: 'Playful and curious Maine Coon kitten with beautiful long fur.',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Up to date',
    neutered: false,
    adoptionStatus: 'Pending Adoption',
    rescueDate: '2023-07-15T09:45:00Z',
    image: 'https://images.unsplash.com/photo-1615455134691-6141b358fd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFpbmUlMjBjb29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    medicalRecords: [
      { date: '2023-07-16', treatment: 'Initial checkup', notes: 'Healthy, slightly underweight' },
      { date: '2023-07-30', treatment: 'Follow-up', notes: 'Weight gain, healthy development' }
    ]
  },
  {
    id: '5',
    name: 'Bella',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: 6,
    gender: 'Female',
    description: 'Sweet and calm Labrador who loves water and being around people.',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Up to date',
    neutered: true,
    adoptionStatus: 'Available',
    rescueDate: '2023-02-10T11:20:00Z',
    image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGFicmFkb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    medicalRecords: [
      { date: '2023-02-12', treatment: 'Initial checkup', notes: 'Healthy, good condition' },
      { date: '2023-03-15', treatment: 'Dental cleaning', notes: 'Teeth cleaned, no issues' }
    ]
  }
];

// Mock data for volunteers
export const mockVolunteers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    availability: 'Weekends',
    skills: ['Dog Walking', 'Animal Feeding', 'Grooming'],
    startDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    availability: 'Evenings',
    skills: ['Cat Socialization', 'Veterinary Assistant', 'Administration'],
    startDate: '2023-03-10',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Miguel Rodriguez',
    email: 'miguel@example.com',
    phone: '555-567-8901',
    address: '789 Pine Rd, Elsewhere, USA',
    availability: 'Weekday Mornings',
    skills: ['Transportation', 'Dog Training', 'Fundraising'],
    startDate: '2023-05-22',
    status: 'Active'
  }
];

// Mock data for adoptions
export const mockAdoptions = [
  {
    id: '1',
    animalId: '4',
    applicantName: 'David Wilson',
    applicantEmail: 'david@example.com',
    applicantPhone: '555-222-3333',
    applicantAddress: '101 Cedar St, Anytown, USA',
    housingType: 'House with yard',
    hasOtherPets: true,
    otherPetsDetails: '1 cat, 5 years old',
    hasChildren: false,
    applicationDate: '2023-08-01T14:30:00Z',
    status: 'Pending',
    approvalDate: null,
    notes: 'Home visit scheduled for next week'
  },
  {
    id: '2',
    animalId: '2',
    applicantName: 'Emma Garcia',
    applicantEmail: 'emma@example.com',
    applicantPhone: '555-444-5555',
    applicantAddress: '202 Maple Ave, Somewhere, USA',
    housingType: 'Apartment',
    hasOtherPets: false,
    otherPetsDetails: '',
    hasChildren: true,
    applicationDate: '2023-07-25T10:15:00Z',
    status: 'Reviewing',
    approvalDate: null,
    notes: 'First-time pet owner, good initial interview'
  }
];

// Mock data for donations
export const mockDonations = [
  {
    id: '1',
    donorName: 'Robert Brown',
    donorEmail: 'robert@example.com',
    amount: 100,
    paymentMethod: 'Credit Card',
    date: '2023-08-05T09:30:00Z',
    purpose: 'General',
    isRecurring: false,
    notes: 'In memory of Buddy'
  },
  {
    id: '2',
    donorName: 'Jennifer Lee',
    donorEmail: 'jennifer@example.com',
    amount: 50,
    paymentMethod: 'PayPal',
    date: '2023-08-03T15:45:00Z',
    purpose: 'Medical Expenses',
    isRecurring: true,
    frequency: 'Monthly',
    notes: ''
  },
  {
    id: '3',
    donorName: 'Anonymous',
    donorEmail: '',
    amount: 250,
    paymentMethod: 'Bank Transfer',
    date: '2023-07-28T11:20:00Z',
    purpose: 'Shelter Improvements',
    isRecurring: false,
    notes: 'Anonymous donation'
  }
];

// Mock data for incidents
export const mockIncidents = [
  {
    id: '1',
    reporterName: 'Maria Thompson',
    reporterPhone: '555-111-2222',
    animalType: 'Dog',
    description: 'Stray dog limping near Central Park',
    location: 'Central Park, near the fountain',
    date: '2023-08-06T16:30:00Z',
    status: 'Under Investigation',
    priority: 'High',
    assignedTo: '1', // Volunteer ID
    images: ['https://images.unsplash.com/photo-1583512603784-a8e3ea8355b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nJTIwbGltcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'],
    notes: 'Dispatch sent a volunteer to assess'
  },
  {
    id: '2',
    reporterName: 'James Wilson',
    reporterPhone: '555-333-4444',
    animalType: 'Cat',
    description: 'Kittens abandoned in a box behind grocery store',
    location: 'Behind Food Mart at 123 Commerce St',
    date: '2023-08-05T13:15:00Z',
    status: 'Resolved',
    priority: 'Medium',
    assignedTo: '2', // Volunteer ID
    images: ['https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2l0dGVucyUyMGJveHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'],
    notes: 'Kittens rescued and brought to shelter, appear healthy'
  }
]; 