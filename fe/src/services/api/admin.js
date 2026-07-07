import axiosClient from './axiosClient';

const adminService = {
  adminGetUsers: async () => {
    const res = await axiosClient.get('/admin/users');
    return res.data; // Returns ApiResponse
  },

  adminToggleLockUser: async (userId) => {
    const res = await axiosClient.post(`/admin/users/${userId}/toggle-lock`);
    return res.data;
  },

  adminUpdateUserRole: async (userId, role) => {
    const res = await axiosClient.put(`/admin/users/${userId}/role`, JSON.stringify(role), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  },

  adminCreateUser: async (userData) => {
    const res = await axiosClient.post('/admin/users', userData);
    return res.data;
  },

  adminUpdateUser: async (userId, userData) => {
    const res = await axiosClient.put(`/admin/users/${userId}`, userData);
    return res.data;
  },

  adminGetHomes: async () => {
    const res = await axiosClient.get('/admin/homes');
    return res.data;
  },

  adminDeleteHome: async (homeId) => {
    const res = await axiosClient.delete(`/admin/homes/${homeId}`);
    return res.data;
  },

  adminGetHomeDetail: async (homeId) => {
    const res = await axiosClient.get(`/admin/homes/${homeId}/detail`);
    return res.data;
  },

  adminUpdateDevice: async (deviceId, deviceData) => {
    const res = await axiosClient.put(`/admin/devices/${deviceId}`, deviceData);
    return res.data;
  },

  adminCreateHome: async (homeData) => {
    const res = await axiosClient.post('/admin/homes', homeData);
    return res.data;
  },

  adminGetUnlinkedUsers: async () => {
    const res = await axiosClient.get('/admin/users/unlinked');
    return res.data;
  },

  adminLinkOwner: async (homeId, userId) => {
    const res = await axiosClient.post(`/admin/homes/${homeId}/link-owner/${userId}`);
    return res.data;
  },

  adminGenerateFirmware: async (payload) => {
    const res = await axiosClient.post('/admin/firmware/generate', payload);
    return res.data;
  },

  adminGetHomeDevices: async (homeId) => {
    const res = await axiosClient.get(`/admin/homes/${homeId}/devices`);
    return res.data;
  },

  adminPingDevice: async (deviceId) => {
    const res = await axiosClient.post(`/admin/devices/${deviceId}/ping`);
    return res.data;
  },

  adminPingAllDevices: async (homeId) => {
    const res = await axiosClient.post(`/admin/homes/${homeId}/ping-all`);
    return res.data;
  },

  adminGetLogs: async (search, page = 0, size = 20, startDate = '', endDate = '') => {
    const res = await axiosClient.get('/admin/logs', {
      params: { search, page, size, startDate, endDate }
    });
    return res.data;
  }
};

export default adminService;
