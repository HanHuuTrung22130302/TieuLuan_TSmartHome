import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

class WsService {
  constructor() {
    this.client = null;
  }

  connect(onMessageReceived) {
    const token = localStorage.getItem('token');

    this.client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws-smarthome?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/home-dashboard', (message) => {
        if (message.body) {
          const rawData = JSON.parse(message.body);
          onMessageReceived(rawData);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error(frame.headers['message']);
      console.error(frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

const wsService = new WsService();
export default wsService;