import axiosClient from './axiosClient';

export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosClient.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
