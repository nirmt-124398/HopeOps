import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import logo from '/HOPEOPS LOGO.png';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Simplified scroll event listener (removed progressive blur)
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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
    { path: '/developers', label: 'Developers' },
    ...(user?.role !== 'NGO_ADMIN' ? [{ path: '/subscription-plans', label: 'Pricing' }] : []),
  ];

  const actionNavItems = [
    { path: '/report-incident', label: 'Report Incident', className: 'bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition' },
  ];

  const userNavItems = [
    { path: '/profile', label: 'My Profile', show: true }
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard', show: isAdmin() },
  ];

  return (
    <>
      {/* Placeholder div to create space for the fixed header */}
      <div className={`w-full ${scrolled ? 'h-[72px]' : 'h-[88px]'}`}></div>
      
      <motion.header 
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-primary shadow-lg ${
          scrolled ? 'py-3' : 'py-5'
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Left Side: Logo and Main Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <motion.img 
                  src={logo} 
                  alt="Logo" 
                  className='h-14 md:h-16'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Link>
              
              {/* Main Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {mainNavItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`text-white font-medium text-lg hover:text-secondary transition-colors duration-300 ${isActive(item.path)}`}
                  >
                    <motion.span 
                      whileHover={{ y: -2 }}
                      className="relative inline-block py-2"
                    >
                      {item.label}
                      <motion.span 
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary" 
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.span>
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
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2.5 px-5 block"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative group z-20">
                  <motion.button 
                    className="flex items-center space-x-2 bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-secondary/90 transition shadow-md text-base"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>Welcome, {user.name || user.username || user.email}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg py-1 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300"
                  >
                    {userNavItems.map((item) => (
                      item.show && (
                        <Link 
                          key={item.path}
                          to={item.path} 
                          className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                    <Link 
                      to="/my-donations" 
                      className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      My Donations
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <motion.div 
                    className="bg-secondary text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-secondary/90 transition-all duration-300 text-base font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.div>
                </Link>
              )}

              {/* Admin Section */}
              <div className="hidden md:flex items-center border-l border-white/30 pl-6">
                {adminNavItems.map((item) => (
                  item.show && (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className="text-white hover:text-secondary transition-colors duration-300 text-base font-medium"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="py-2 block"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  )
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button 
                onClick={toggleMobileMenu} 
                className="text-white focus:outline-none p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation with Animation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 pb-4 bg-primary border-t border-white/10 shadow-lg p-4"
              >
                <div className="flex flex-col space-y-6">
                  {/* Main Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/70">Main Menu</h3>
                    {mainNavItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className="block text-white hover:text-secondary transition-colors duration-300 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/70">Actions</h3>
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
                    <h3 className="text-sm font-semibold text-white/70">Account</h3>
                    {user ? (
                      <>
                        {userNavItems.map((item) => (
                          item.show && (
                            <Link 
                              key={item.path}
                              to={item.path} 
                              className="block text-white hover:text-secondary transition-colors duration-300 py-2"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          )
                        ))}
                        <Link 
                          to="/my-donations" 
                          className="block text-white hover:text-secondary transition-colors duration-300 py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Donations
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left text-white hover:text-secondary transition-colors duration-300 py-2"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link 
                        to="/login" 
                        className="block bg-secondary text-white px-4 py-2.5 rounded-lg hover:bg-secondary/90 transition-all duration-300 text-center my-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </div>

                  {/* Admin */}
                  {isAdmin() && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-white/70">Admin</h3>
                      {adminNavItems.map((item) => (
                        item.show && (
                          <Link 
                            key={item.path}
                            to={item.path} 
                            className="block text-white hover:text-secondary transition-colors duration-300 py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};

export default Header;