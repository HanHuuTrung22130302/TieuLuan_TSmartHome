import axiosClient from './axiosClient';

export const getWarningList = async (params) => {
  try {
    const response = await axiosClient.get('/warning-history/list', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWarningStats = async (params) => {
  try {
    const response = await axiosClient.get('/warning-history/stats', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};