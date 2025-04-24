import axios from 'axios';

const apiRequest= axios.create({
    baseURL: `${import.meta.env.VITE_Backend_URL}/api`,
    withCredentials: true
}); 
apiRequest.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('user'); // Or however you store your token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
export default apiRequest;