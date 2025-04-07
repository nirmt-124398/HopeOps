import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import AnimalCard from '../components/animals/AnimalCard';
import ScrollFade from '../components/ui/ScrollFade';
import HorizontalScroll from '../components/ui/HorizontalScroll';
import { useAnimals } from '../context/AnimalsContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const animalsContext = useAnimals();
  
  // Safely destructure with fallback values to prevent errors
  const { animals = [], loading = true } = animalsContext || {};
  
  // Get featured animals (first 4 available animals)
  const featuredAnimals = !loading && animals.length > 0
    ? animals
        .filter(animal => animal.adoptionStatus === 'Available')
        .slice(0, 4)
    : [];

  return (
    <div>
      {/* Hero Section */}
      <ScrollFade>
        <section className="relative group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1444212477490-ca407925329e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D')"
            }}>
          </div>
          <div className="absolute inset-0 bg-black opacity-70 transition-opacity duration-700 group-hover:opacity-40"></div>
          <div className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Give a Loving Home to an Animal in Need</h1>
            <p className="text-xl max-w-2xl mb-8">
              We rescue, rehabilitate, and rehome abandoned, abused, and neglected animals. Join us in our mission.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/animals">
                <Button variant="secondary" size="lg">Adopt a Pet</Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="lg" className="bg-white bg-opacity-20 hover:bg-opacity-30 border-white text-white">Donate Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollFade>
      
      {/* Mission Section */}
      <ScrollFade>
        <section className="py-16 bg-lightGreen">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-10">
                Our mission is to provide care, shelter, and medical attention to animals in distress, and to find them loving forever homes. 
                We believe every animal deserves a chance at a happy and healthy life.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg shadow-md outline outline-2 outline-secondary">
                  <div className="text-secondary text-4xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Rescue</h3>
                  <p className="text-gray-600">
                    We respond to reports of animals in distress and work with local authorities to rescue them.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg shadow-md outline outline-2 outline-secondary">
                  <div className="text-secondary text-4xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Rehabilitate</h3>
                  <p className="text-gray-600">
                    Our dedicated team provides medical care, nutrition, and love to help animals recover.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg shadow-md outline outline-2 outline-secondary">
                  <div className="text-secondary text-4xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Rehome</h3>
                  <p className="text-gray-600">
                    We match animals with loving families who can provide them with forever homes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollFade>
      
      {/* Featured Animals */}
      <ScrollFade>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Animals Looking for a Home</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredAnimals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <Link to="/animals">
                    <Button variant="primary" size="lg">View All Animals</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </ScrollFade>
      
      {/* Horizontal Scroll Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <HorizontalScroll />
        </div>
      </section>
      
      {/* Volunteer */}
      <ScrollFade>
        <section className="py-16 bg-secondary text-accent">
          <div className="container mx-auto px-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-6">Become a Volunteer</h2>
                <p className="text-lg mb-6">
                  Our volunteers are the backbone of our organization. From walking dogs to assisting with adoptions, 
                  there are many ways you can help make a difference in these animals' lives.
                </p>
                <Link to="/volunteer">
                  <Button variant="accent" size="lg">Join Our Team</Button>
                </Link>
              </div>
              <div className="md:w-1/2 md:pl-10 relative group overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1541532108062-73f2181a08c8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Volunteer with dog" 
                  className="rounded-lg shadow-xl w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </section>
      </ScrollFade>
      
      {/* Emergency Help */}
      <ScrollFade>
        <section className="py-16 bg-cream text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-accent mb-6 animate-pulse">Report an Animal in Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Have you spotted an injured or abandoned animal? Don't wait - report it immediately so we can help.
            </p>
            <Link to="/report-incident">
              <Button variant="danger" size="lg" style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}>Report Now</Button>
            </Link>
          </div>
        </section>
      </ScrollFade>
    </div>
  );
};

export default Home;