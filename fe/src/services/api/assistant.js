import axiosClient from './axiosClient';

export const sendAssistantChat = async (message) => {
  try {
    // Lấy userId đã lưu ở localStorage khi đăng nhập thành công
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    // Bắn API gửi kèm cả userId và message vào chung trong Request Body
    const response = await axiosClient.post('/assistant/chat', { 
      userId: userId,
      message: message 
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAssistantHistory = async (page = 0) => {
  try {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const response = await axiosClient.get('/assistant/history', {
      params: {
        userId: userId,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};