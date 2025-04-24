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
    // Check if userData has a token property, if not add a placeholder
    // This helps with identifying authenticated users even if the real token is in cookies
    const enhancedUserData = {
      ...userData,
      token: userData.token || 'cookie-auth' // Use existing token or placeholder
    };
    
    setUser(enhancedUserData);
    localStorage.setItem('user', JSON.stringify(enhancedUserData));
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update user function (from the second context)
  const updateUser = (userData) => {
    // Preserve token if it exists in current user data
    const currentUser = user || {};
    const updatedUser = {
      ...userData,
      token: userData.token || currentUser.token || 'cookie-auth'
    };
    
    setUser(updatedUser);
  };

  // Admin check function
  const isAdmin = () => {
    return user?.role === 'NGO_ADMIN';
  };

  // Context value to be provided
  const contextValue = {
    user,
    login,
    logout,
    updateUser,
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