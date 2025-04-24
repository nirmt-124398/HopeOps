import axios from 'axios';

const apiRequest= axios.create({
    baseURL: `${import.meta.env.VITE_Backend_URL}/api`,
    withCredentials: true
}); 
apiRequest.interceptors.request.use(
    (config) => {
      // Get the user object from localStorage
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        try {
          // Parse the user object to extract the token
          const user = JSON.parse(userStr);
          const token = user.token || user;
          
          // Set the authorization header
          config.headers.Authorization = `Bearer ${token}`;
          
          // For debugging
          console.log('Token sent in request:', token);
        } catch (error) {
          console.error('Error parsing user token:', error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
export default apiRequest;