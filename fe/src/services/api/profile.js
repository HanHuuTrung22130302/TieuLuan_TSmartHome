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

export const generateTelegramCode = async () => {
  try {
    const response = await axiosClient.post('/users/profile/telegram/code');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const disconnectTelegram = async () => {
  try {
    const response = await axiosClient.delete('/users/profile/telegram');
    return response.data;
  } catch (error) {
    throw error;
  }
};
