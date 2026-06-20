import axiosClient from './axiosClient';

export const getSecuritySidebar = async () => {
  try {
    const response = await axiosClient.get('/devices/security-sidebar');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCameraCaptures = async (homeId, filter = 'all', page = 0, size = 5) => {
  try {
    const response = await axiosClient.get(`/camera/captures?homeId=${homeId}&filter=${filter}&page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};