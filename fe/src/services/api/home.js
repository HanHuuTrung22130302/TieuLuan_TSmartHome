import axiosClient from './axiosClient';

export const getMyHomes = async () => {
  try {
    const response = await axiosClient.get('/homes/mine');
    return response.data;
  } catch (error) {
    throw error;
  }
};
