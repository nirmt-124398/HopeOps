import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import logo from '/HOPEOPS LOGO.png' 

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

  // Navigation categories
  const mainNavItems = [
    { path: '/', label: 'Home' },
    { path: '/animals', label: 'Animals' },
    { path: '/adopt', label: 'Adopt' },
    { path: '/donate', label: 'Donate' },
    { path: '/subscription-plans', label: 'Pricing' },
  ];

  const actionNavItems = [
    { path: '/report-incident', label: 'Report Incident', className: 'bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-800 transition' },
  ];

  const userNavItems = [
    { path: '/profile', label: 'My Profile', show: true },
    { path: '/ngo/profile', label: 'NGO Profile', show: user?.role === 'NGO_ADMIN' },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard', show: isAdmin() },
  ];

  return (
    <motion.header 
      className="bg-primary text-white shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side: Logo and Main Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className='h-10'/>
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {mainNavItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`hover:text-secondary ${isActive(item.path)}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side: Actions, User Menu, and Admin */}
          <div className="flex items-center space-x-6">
            {/* Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {actionNavItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`${item.className} ${isActive(item.path)}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
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
                       if (e.currentTarget) {
                         e.currentTarget.classList.add('delay-hide');
                         setTimeout(() => {
                           if (e.currentTarget && e.currentTarget.classList.contains('delay-hide')) {
                             e.currentTarget.classList.remove('delay-hide');
                           }
                         }, 500);
                       }
                     }}>
                  {userNavItems.map((item) => (
                    item.show && (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
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

            {/* Admin Section */}
            <div className="hidden md:flex items-center border-l border-gray-600 pl-6">
              {adminNavItems.map((item) => (
                item.show && (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`hover:text-secondary ${isActive(item.path)}`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-6">
              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Main Menu</h3>
                {mainNavItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`block hover:text-secondary ${isActive(item.path)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Actions</h3>
                {actionNavItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`block ${item.className} ${isActive(item.path)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Account */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Account</h3>
                {user ? (
                  <>
                    {userNavItems.map((item) => (
                      item.show && (
                        <Link 
                          key={item.path}
                          to={item.path} 
                          className="block hover:text-secondary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block bg-secondary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Admin */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Admin</h3>
                {adminNavItems.map((item) => (
                  item.show && (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className="block hover:text-secondary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;