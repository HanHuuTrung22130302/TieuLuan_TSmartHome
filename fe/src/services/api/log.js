import axiosClient from './axiosClient';

export const getRecentLogs = async (timeFilter = '12H', deviceType = 'all', page = 0, size = 50) => {
  try {
    const response = await axiosClient.get('/logs/recent', {
      params: { timeFilter, deviceType, page, size }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};