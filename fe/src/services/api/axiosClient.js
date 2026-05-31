import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const axiosClient = axios.create({
  // baseURL: 'http://171.227.82.185:8080/api',
  baseURL: '/api', // Sử dụng proxy để tránh hardcode URL backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm dọn dẹp toàn bộ dữ liệu xác thực (Đã bổ sung xóa sạch các trường mới)
const clearAuthAndRedirect = () => {
  const keysToRemove = ['token', 'refreshToken', 'userId', 'fullName', 'email'];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  window.location.href = '/login'; 
};

// 1. Gắn Token vào mọi Request gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Bắt lỗi trả về và tự động Refresh Token nếu gặp 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        // const res = await axios.post('http://localhost:8080/api/auth/refresh', {
        //   refreshToken: refreshToken
        // });
        // const res = await axios.post('http://171.227.82.185:8080/api/auth/refresh', {
        //   refreshToken: refreshToken
        // });
        const res = await axios.post('/api/auth/refresh', {
          refreshToken: refreshToken
        });

        if (res.data && res.data.code === 1000) {
          const newToken = res.data.data.token;
          const newRefreshToken = res.data.data.refreshToken;

          // Lưu token mới vào đúng vị trí Storage ban đầu
          if (localStorage.getItem('token')) {
            localStorage.setItem('token', newToken);
          } else if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('token', newToken);
          }
          
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;