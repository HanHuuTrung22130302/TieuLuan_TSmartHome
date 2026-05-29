package com.tsmarthome.be.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // React.js (cổng 5173) sẽ kết nối vào endpoint này
//        registry.addEndpoint("/ws-smarthome")
//                .setAllowedOrigins("http://localhost:5173")
//                .withSockJS(); // Hỗ trợ fallback nếu browser không có WebSocket thuần
        registry.addEndpoint("/ws-smarthome")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Các topic nội bộ mà Frontend sẽ lắng nghe (subscribe)
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}