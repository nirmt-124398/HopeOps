import axios from 'axios';

const apiRequest = axios.create({
    baseURL: `${import.meta.env.VITE_Backend_URL}/api`,
    withCredentials: true // This ensures cookies are sent with every request
}); 

// Add a request interceptor to include token in headers if available
apiRequest.interceptors.request.use(
    (config) => {
      try {
        // Try to get the token from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.token) {
            // Set the Authorization header with the token
            config.headers['Authorization'] = `Bearer ${user.token}`;
          }
        }
      } catch (error) {
        console.error('Error setting auth header:', error);
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
apiRequest.interceptors.response.use(
    (response) => response,
    (error) => {
      // If we get a 401 error, the user might be logged out
      if (error.response && error.response.status === 401) {
        console.error('Authentication error:', error.response.data);
      }
      return Promise.reject(error);
    }
);

export default apiRequest;