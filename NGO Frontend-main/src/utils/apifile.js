import axios from 'axios';

const apiRequest = axios.create({
    baseURL: `${import.meta.env.VITE_Backend_URL}/api`,
    withCredentials: true
}); 

apiRequest.interceptors.request.use(
    (config) => {
      try {
        const userStr = localStorage.getItem('user');
        
        if (userStr) {
          // Parse the user object from localStorage
          const user = JSON.parse(userStr);
          
          // Set Authorization header with token from localStorage

          console.log('Checking Validity of:', user.token);
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
      } catch (error) {
        console.error('Error setting auth header:', error);
      }
      
      return config;
    },
    (error) => Promise.reject(error)
);

export default apiRequest;