import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const authService = {
  register: async (userData) => {
    // userData: { firstName, lastName, email, password, confirmPassword }
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    // credentials: { email, password, rememberMe }
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/refresh`, { refreshToken: token });
    return response.data;
  },
  // THÊM 3 HÀM MỚI CHO QUÊN MẬT KHẨU
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response.data;
  },

  verifyOtp: async (data) => {
    // data: { email, otpCode }
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, data);
    return response.data;
  },

  resetPassword: async (data) => {
    // data: { email, otpCode, newPassword, confirmPassword }
    const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
    return response.data;
  }
};

export default authService;