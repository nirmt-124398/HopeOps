import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Storage is already handled in the initial state,
    // now just complete the loading state
    setLoading(false);
  }, []);

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;  // Returns a boolean value indicating success
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update user function (from the second context)
  const updateUser = (userData) => {
    setUser(userData);
    // No explicit localStorage update (though the useEffect will handle this)
    // No return value
  };

  // Admin check function
  const isAdmin = () => {
    return  user?.role === 'NGO_ADMIN';
  };

  // Context value to be provided
  const contextValue = {
    user,
    login, // takes res.data
    logout,
    updateUser, // Added from the second context, takes res.data
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;