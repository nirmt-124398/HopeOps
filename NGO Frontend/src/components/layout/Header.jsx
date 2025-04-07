import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'border-b-2 border-secondary' : '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header 
      className="bg-primary text-white shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">NGO Animal Rescue</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`hover:text-secondary ${isActive('/')}`}>Home</Link>
            <Link to="/animals" className={`hover:text-secondary ${isActive('/animals')}`}>Animals</Link>
            <Link to="/adopt" className={`hover:text-secondary ${isActive('/adopt')}`}>Adopt</Link>
            <Link to="/donate" className={`hover:text-secondary ${isActive('/donate')}`}>Donate</Link>
            <Link to="/report-incident" className={`bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-800 transition ${isActive('/report-incident')}`}>Report Incident</Link>
            
            {isAdmin() && (
              <Link to="/admin" className={`hover:text-secondary ${isActive('/admin')}`}>Admin</Link>
            )}
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                  <span>Welcome, {user.name || user.username || user.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-0.5 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block transition-all duration-300"
                     style={{ transitionDelay: '1.5s' }}
                     onMouseLeave={(e) => {
                       // Check if the element exists before accessing classList
                       if (e.currentTarget) {
                         e.currentTarget.classList.add('delay-hide');
                         setTimeout(() => {
                           // Double-check if element still exists before removing class
                           if (e.currentTarget && e.currentTarget.classList.contains('delay-hide')) {
                             e.currentTarget.classList.remove('delay-hide');
                           }
                         }, 500);
                       }
                     }}>
                  <Link to="/profile" className="block px-4 py-3 text-gray-800 hover:bg-gray-100">
                    My Profile
                  </Link>
                  {user?.role === 'NGO_ADMIN' && (
                    <Link to="/ngo/profile" className="block px-4 py-3 text-gray-800 hover:bg-gray-100">
                      NGO Profile
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                Login
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-primary shadow-lg border-t border-gray-700 mt-4 rounded-b-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <nav className="flex flex-col py-4">
              <Link to="/" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/animals" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Animals</Link>
              <Link to="/adopt" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Adopt</Link>
              <Link to="/volunteer" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Volunteer</Link>
              <Link to="/donate" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Donate</Link>
              <div className="px-6 py-3">
                <Link 
                  to="/report-incident" 
                  className="block bg-red-600 text-white font-semibold px-4 py-3 rounded-md text-center hover:bg-red-800 transition-colors w-full" 
                  onClick={toggleMobileMenu}
                >
                  Report Incident
                </Link>
              </div>
              {isAdmin() && (
                <Link to="/admin" className="px-6 py-3 hover:bg-blue-800 hover:text-secondary transition-colors text-center" onClick={toggleMobileMenu}>Admin</Link>
              )}
              <div className="px-6 py-3">
                {user ? (
                  <div className="space-y-2">
                    <Link 
                      to="/profile" 
                      className="block bg-secondary text-white font-semibold px-4 py-3 rounded-md text-center hover:bg-opacity-90 transition-colors w-full"
                      onClick={toggleMobileMenu}
                    >
                      My Profile
                    </Link>
                    {user.role === 'NGO_ADMIN' && (
                      <Link 
                        to="/ngo/profile" 
                        className="block bg-secondary text-white font-semibold px-4 py-3 rounded-md text-center hover:bg-opacity-90 transition-colors w-full"
                        onClick={toggleMobileMenu}
                      >
                        NGO Profile
                      </Link>
                    )}
                    <button 
                      onClick={() => { handleLogout(); toggleMobileMenu(); }}
                      className="w-full bg-orange-500 text-white font-semibold px-4 py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="block bg-orange-500 text-white font-semibold px-4 py-3 rounded-md text-center hover:bg-orange-600 transition-colors w-full"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;