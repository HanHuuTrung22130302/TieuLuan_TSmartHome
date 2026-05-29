import axiosClient from './axiosClient';

const authService = {
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials, rememberMe = true) => {
    const response = await axiosClient.post('/auth/login', credentials);
    
    // Nếu đăng nhập thành công từ Backend
    if (response.data && response.data.code === 1000) {
      const { token, refreshToken, email, userId, fullName } = response.data.data;
      
      // Lựa chọn Storage dựa trên tính năng "Ghi nhớ đăng nhập"
      const storage = rememberMe ? localStorage : sessionStorage;

      // Lưu lẻ các trường để các service khác (như assistant.js) lấy trực tiếp bằng getItem
      storage.setItem('token', token);
      storage.setItem('email', email);
      storage.setItem('userId', userId);
      storage.setItem('fullName', fullName);

      // Riêng refreshToken luôn lưu ở localStorage để hỗ trợ giữ phiên lâu dài
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    
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