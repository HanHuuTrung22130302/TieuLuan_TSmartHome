import axiosClient from './axiosClient';

export const getMapDevices = async () => {
  try {
    const response = await axiosClient.get('/devices/map');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCameraStreams = async () => {
  try {
    const response = await axiosClient.get('/devices/cameras');
    return response.data;
  } catch (error) {
    throw error;
  }
};