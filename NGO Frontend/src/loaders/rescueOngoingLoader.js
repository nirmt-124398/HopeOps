import apiRequest from '../utils/apifile';

export const rescueOngoingLoader = async () => {
  try {
    const response = await apiRequest.get('/api/emergency/ngo/ongoing');
    return response.data;
  } catch (error) {
    console.error('Error loading ongoing rescue operations:', error);
    return [];
  }
}; 