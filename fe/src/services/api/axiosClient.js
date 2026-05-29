import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const axiosClient = axios.create({
  baseURL: 'http://171.227.82.185:8080/api',
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

  // Kiểm tra nếu chưa ở trang login thì mới đá về tránh lặp vô hạn
  if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
    window.location.href = '/login'; 
  }
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

// 2. Bắt lỗi trả về - Hỗ trợ đá về Login tự động khi BE restart (401/403)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    // Bắt cả 401 (Hết hạn) và 403 (Token lỗi do BE bị reset đổi Secret Key ngầm)
    if ((status === 401 || status === 403) && !originalRequest._retry) {
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
        const res = await axios.post('http://171.227.82.185:8080/api/auth/refresh', {
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
        } else {
          // Trường hợp API trả về lỗi code khác 1000 (Ví dụ: Refresh Token hết hạn trong DB)
          clearAuthAndRedirect();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh thất bại (Backend sập dữ liệu cũ / reset hoàn toàn session)
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;