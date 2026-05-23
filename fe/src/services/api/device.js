import axiosClient from './axiosClient';

export const getDevices = async (params) => {
  try {
    const response = await axiosClient.get('/devices/list', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const controlDevice = async (id, action) => {
  try {
    const response = await axiosClient.post(`/devices/${id}/control`, { action });
    return response.data;
  } catch (error) {
    throw error;
  }
};