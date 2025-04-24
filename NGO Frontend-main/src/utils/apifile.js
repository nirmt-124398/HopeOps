import axios from 'axios';

const apiRequest= axios.create({
    baseURL: `${import.meta.env.VITE_Backend_URL}/api`,
    withCredentials: true
}); 

apiRequest.interceptors.request.use(
    (config) => {
      try {
        const userStr = localStorage.getItem('user');
        
        if (userStr) {
          // Parse the user object
          const user = JSON.parse(userStr);
          
          // Check if user contains a token property directly
          console.log('User Token:', user.token);
          if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log('Using token from user.token');
          } 
          // For login responses that directly include the token in the response body
          else if (typeof user === 'string') {
            config.headers.Authorization = `Bearer ${user}`;
            console.log('Using user as token string');
          }
          // No token in the user object, authentication is handled by cookies
          else {
            console.log('No explicit token, relying on cookies for auth');
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