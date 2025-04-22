import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import AnimalCard from '../components/animals/AnimalCard';
import ScrollFade from '../components/ui/ScrollFade';
import HorizontalScroll from '../components/ui/HorizontalScroll';
import { useAnimals } from '../context/AnimalsContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const animalsContext = useAnimals();
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position for progressive effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Safely destructure with fallback values to prevent errors
  const { animals = [], loading = true } = animalsContext || {};
  
  // Get featured animals (first 4 available animals)
  const featuredAnimals = !loading && animals.length > 0
    ? animals
        .filter(animal => animal.adoptionStatus === 'Available')
        .slice(0, 4)
    : [];

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Progressive blur calculations
  const calculateBlur = (offsetStart, intensity = 1) => {
    // Start blurring after scrolling past offsetStart pixels
    const scrollOffset = Math.max(0, scrollY - offsetStart);
    // Max blur of 10px, scaled by intensity
    return Math.min(scrollOffset / 100 * intensity, 10);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Glassmorphism and Progressive Blur */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1444212477490-ca407925329e?w=1200&auto=format&fit=crop&q=80')",
            filter: "brightness(0.7)"
          }}>
        </div>

        {/* Glassmorphism overlay with progressive blur effect */}
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-r from-primary/30 to-secondary/30"
          style={{ 
            backdropFilter: `blur(${Math.min(2 + calculateBlur(50, 0.5), 8)}px)` 
          }}
        ></div>
        
        {/* Animated shapes in background */}
        <motion.div 
          className="absolute -right-20 top-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl z-5"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 40, 0]
          }} 
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut" 
          }}
          style={{
            filter: `blur(${30 + calculateBlur(100, 0.8)}px)`
          }}
        />
        <motion.div 
          className="absolute -left-40 bottom-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl z-5"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0]
          }} 
          transition={{ 
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut" 
          }}
          style={{
            filter: `blur(${30 + calculateBlur(100, 0.8)}px)`
          }}
        />

        {/* Content */}
        <div className="relative container mx-auto px-6 z-20 pt-28">
          <motion.div 
            className="max-w-3xl mx-auto text-center" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              transform: `translateY(${Math.min(scrollY * 0.2, 80)}px)`,
              opacity: Math.max(1 - scrollY / 600, 0)
            }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Give a Loving Home to an Animal in Need
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              We rescue, rehabilitate, and rehome abandoned, abused, and neglected animals. Join us in our mission.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link to="/animals">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white/15 backdrop-blur-md rounded-full border border-white/30 text-white font-semibold shadow-lg hover:bg-white/25 transition-all duration-300"
                >
                  Adopt a Pet
                </motion.div>
              </Link>
              <Link to="/donate">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-secondary/80 backdrop-blur-md rounded-full text-white font-semibold shadow-lg hover:bg-secondary/90 transition-all duration-300"
                >
                  Donate Now
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-lightGreen/30"></div>
        
        {/* Glassmorphism container with progressive blur */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-14">
              Our mission is to provide care, shelter, and medical attention to animals in distress, and to find them loving forever homes. 
              We believe every animal deserves a chance at a happy and healthy life.
            </p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
                  title: "Rescue",
                  description: "We respond to reports of animals in distress and work with local authorities to rescue them."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
                  title: "Rehabilitate",
                  description: "Our dedicated team provides medical care, nutrition, and love to help animals recover."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
                  title: "Rehome",
                  description: "We match animals with loving families who can provide them with forever homes."
                },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariant}
                  className="p-8 rounded-2xl shadow-lg border border-white/60 hover:transform hover:scale-105 transition-all duration-300"
                  style={{
                    backdropFilter: `blur(${calculateBlur(600 + index * 50, 0.4)}px)`,
                    backgroundColor: `rgba(255, 255, 255, ${0.7 + calculateBlur(600 + index * 50, 0.01)})`
                  }}
                >
                  <div className="text-secondary text-4xl mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Animals */}
      <section className="py-20 relative overflow-hidden">
        {/* Glassmorphism Background with progressive blur */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
          style={{
            backdropFilter: `blur(${calculateBlur(800, 0.3)}px)`
          }}
        ></div>
        
        {/* Floating orbs for visual effect with progressive blur */}
        <motion.div 
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-primary/10"
          animate={{ y: [-20, 20], x: [-10, 10] }}
          transition={{ yoyo: Infinity, duration: 8 }}
          style={{
            filter: `blur(${30 + calculateBlur(800, 0.5)}px)`
          }}
        />
        <motion.div 
          className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-secondary/10"
          animate={{ y: [20, -20], x: [10, -10] }}
          transition={{ yoyo: Infinity, duration: 7 }}
          style={{
            filter: `blur(${30 + calculateBlur(900, 0.5)}px)`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-800 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Animals Looking for a Home
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={containerVariant}
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true }}
              >
                {featuredAnimals.map((animal, index) => (
                  <motion.div
                    key={animal.id}
                    variants={itemVariant}
                    whileHover={{ y: -10 }}
                    className="transform transition-all duration-300"
                  >
                    {/* Wrapping AnimalCard with glassmorphism effect and progressive blur */}
                    <div 
                      className="rounded-2xl shadow-xl overflow-hidden border border-white/40"
                      style={{
                        backdropFilter: `blur(${calculateBlur(1000 + index * 50, 0.3)}px)`,
                        backgroundColor: `rgba(255, 255, 255, ${0.6 + calculateBlur(1000 + index * 50, 0.01)})`
                      }}
                    >
                      <AnimalCard animal={animal} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-14 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Link to="/animals">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-8 py-3 bg-secondary/80 backdrop-blur-md rounded-full text-white font-semibold shadow-lg hover:bg-secondary/90 transition-all duration-300"
                  >
                    View All Animals
                  </motion.div>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>
      
      {/* Horizontal Scroll Section with Glassmorphism and Progressive Blur */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-100/80 to-gray-200/60"
          style={{
            backdropFilter: `blur(${calculateBlur(1200, 0.4)}px)`
          }}
        ></div>
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <HorizontalScroll />
          </div>
        </div>
      </section>
      
      {/* Emergency Help with Progressive Blur */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-cream to-red-600/10"
          animate={{ 
            background: [
              "linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(255, 248, 231, 1), rgba(220, 38, 38, 0.1))",
              "linear-gradient(to bottom right, rgba(220, 38, 38, 0.1), rgba(255, 248, 231, 1), rgba(239, 68, 68, 0.1))"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Glassmorphism container with progressive blur */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center p-10 rounded-2xl border border-white/50 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              backdropFilter: `blur(${calculateBlur(1500, 0.6)}px)`,
              backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <motion.h2 
              className="text-4xl font-bold text-accent mb-6"
              animate={{ 
                textShadow: ["0 0 8px rgba(220, 38, 38, 0)", "0 0 12px rgba(220, 38, 38, 0.3)", "0 0 8px rgba(220, 38, 38, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Report an Animal in Need
            </motion.h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Have you spotted an injured or abandoned animal? Don't wait - report it immediately so we can help.
            </p>
            <Link to="/report-incident">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-red-600 rounded-full text-white font-semibold shadow-xl hover:bg-red-700 transition-all duration-300"
              >
                Report Now
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;