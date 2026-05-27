import axiosClient from './axiosClient';

export const getSecuritySidebar = async () => {
  try {
    const response = await axiosClient.get('/devices/security-sidebar');
    return response.data;
  } catch (error) {
    throw error;
  }
};