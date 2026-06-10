import axiosClient from './axiosClient';

export const getSchedules = async () => {
  try {
    const response = await axiosClient.get('/schedules/list');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSchedule = async (data) => {
  try {
    const response = await axiosClient.post('/schedules/create', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async (id, data) => {
  try {
    const response = await axiosClient.put(`/schedules/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await axiosClient.delete(`/schedules/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
