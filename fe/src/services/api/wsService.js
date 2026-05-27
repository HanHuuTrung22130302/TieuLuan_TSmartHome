import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

class WsService {
  connect(onMessageReceived) {
    // Khởi tạo client cục bộ, không gắn vào this.client
    const client = new Client({
      webSocketFactory: () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return new SockJS(`http://localhost:8080/ws-smarthome?token=${token}`);
      },
      beforeConnect: () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        client.connectHeaders = {
          Authorization: `Bearer ${token}`
        };
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/home-dashboard', (message) => {
        if (message.body) {
          const rawData = JSON.parse(message.body);
          onMessageReceived(rawData);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error(frame.headers['message']);
      console.error(frame.body);
    };

    client.activate();
    
    // Trả về instance này để Component tự giữ
    return client; 
  }

  // Nhận đúng instance của Component để ngắt
  disconnect(client) {
    if (client) {
      client.deactivate();
    }
  }
}

const wsService = new WsService();
export default wsService;