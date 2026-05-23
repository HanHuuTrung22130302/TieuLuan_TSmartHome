import axiosClient from './axiosClient';

export const getRooms = async () => {
  try {
    const response = await axiosClient.get('/rooms/list');
    return response.data;
  } catch (error) {
    throw error;
  }
};