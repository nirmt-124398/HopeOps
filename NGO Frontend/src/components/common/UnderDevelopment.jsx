import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UnderDevelopment = ({ title = "Coming Soon", message = "This feature is currently under development", returnPath = "/" }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 text-yellow-500 mx-auto" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-lg">
        {message}
      </p>
      
      <div className="relative">
        <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">Our team is working hard to complete this feature</p>
      </div>

      <div className="mt-10">
        <Link 
          to={returnPath}
          className="px-6 py-2.5 bg-secondary text-white rounded-md hover:bg-secondary-dark transition duration-300 inline-flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          HOME
        </Link>
      </div>
    </motion.div>
  );
};

export default UnderDevelopment;
