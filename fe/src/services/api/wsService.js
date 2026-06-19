import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

class WsService {
  connect(homeId, onMessageReceived) {
    if (typeof homeId === 'function') {
      onMessageReceived = homeId;
      homeId = undefined;
    }
    const client = new Client({
      webSocketFactory: () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return new SockJS(`/ws-smarthome?token=${token}`);
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
      const activeHomeId = homeId || localStorage.getItem('activeHomeId') || sessionStorage.getItem('activeHomeId');
      if (activeHomeId) {
        client.subscribe(`/topic/home-dashboard/${activeHomeId}`, (message) => {
          if (message.body) {
            const rawData = JSON.parse(message.body);
            onMessageReceived(rawData);
          }
        });
        client.subscribe(`/topic/smarthome/realtime/${activeHomeId}`, (message) => {
          if (message.body) {
            const rawData = JSON.parse(message.body);
            onMessageReceived(rawData);
          }
        });
      } else {
        client.subscribe('/topic/home-dashboard', (message) => {
          if (message.body) {
            const rawData = JSON.parse(message.body);
            onMessageReceived(rawData);
          }
        });
      }
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