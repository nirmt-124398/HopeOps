import apiRequest from '../utils/apifile';

export const rescueCompletedLoader = async () => {
  try {
    const response = await apiRequest.get('/api/emergency/ngo/completed');
    return response.data;
  } catch (error) {
    console.error('Error loading completed rescue operations:', error);
    return [];
  }
}; 