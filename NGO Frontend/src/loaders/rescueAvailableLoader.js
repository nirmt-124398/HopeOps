import apiRequest from '../utils/apifile';

export const rescueAvailableLoader = async () => {
  try {
    const response = await apiRequest.get('/api/emergency?status=PENDING');
    return response.data;
  } catch (error) {
    console.error('Error loading available rescue operations:', error);
    return [];
  }
}; 