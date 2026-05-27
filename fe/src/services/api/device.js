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

// Thay thế hàm getDeviceHistory trong src/services/api/device.js
export const getDeviceHistory = async (id, filter) => {
  try {
    const params = {};
    // Nếu có filter (ví dụ '3d'), truyền vào params. Nếu rỗng (Hôm nay), không truyền gì.
    if (filter) params.filter = filter; 
    
    const response = await axiosClient.get(`/devices/${id}/history`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Thêm hàm này vào dưới cùng của src/services/api/device.js
export const getDeviceAlerts = async (id, filter) => {
  try {
    const params = {};
    if (filter) params.filter = filter;
    
    const response = await axiosClient.get(`/devices/${id}/alerts`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};