import axiosClient from './axiosClient';

const authService = {
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await axiosClient.post('/auth/refresh', { refreshToken: token });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosClient.post('/auth/verify-otp', data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  }
};

export default authService;