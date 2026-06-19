package com.tsmarthome.be.config;

import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.repository.UserRepository;
import com.tsmarthome.be.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    @Lazy
    private JwtUtil jwtUtil;

    @Autowired
    @Lazy
    private UserDetailsService userDetailsService;

    @Autowired
    @Lazy
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private UserHomeRepository userHomeRepository;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-smarthome")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null) {
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String authHeader = accessor.getFirstNativeHeader("Authorization");
                        if (authHeader == null) {
                            List<String> nativeHeaders = accessor.getNativeHeader("Authorization");
                            if (nativeHeaders != null && !nativeHeaders.isEmpty()) {
                                authHeader = nativeHeaders.get(0);
                            }
                        }
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                            String jwt = authHeader.substring(7);
                            try {
                                String userEmail = jwtUtil.extractUsername(jwt);
                                if (userEmail != null) {
                                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                                    if (jwtUtil.validateToken(jwt, userDetails)) {
                                        UsernamePasswordAuthenticationToken authentication =
                                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                        accessor.setUser(authentication);
                                    }
                                }
                            } catch (Exception e) {
                                log.error("Lỗi xác thực WebSocket CONNECT: {}", e.getMessage());
                            }
                        }
                    } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                        String destination = accessor.getDestination();
                        Principal principal = accessor.getUser();
                        if (destination != null && (destination.startsWith("/topic/home-dashboard/") || destination.startsWith("/topic/smarthome/realtime/"))) {
                            String homeIdStr = destination.substring(destination.lastIndexOf("/") + 1);
                            try {
                                UUID homeId = UUID.fromString(homeIdStr);
                                if (principal instanceof UsernamePasswordAuthenticationToken) {
                                    UserDetails userDetails = (UserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
                                    String email = userDetails.getUsername();
                                    User user = userRepository.findByEmail(email).orElse(null);
                                    if (user != null) {
                                        List<UUID> homeIds = userHomeRepository.findHomeIdsByUserId(user.getId());
                                        if (!homeIds.contains(homeId)) {
                                            log.warn("User {} bị từ chối subscribe topic: {} do không có quyền trong nhà {}", email, destination, homeId);
                                            throw new IllegalArgumentException("Không có quyền truy cập dữ liệu của ngôi nhà này");
                                        }
                                    } else {
                                        throw new IllegalArgumentException("Không tìm thấy người dùng");
                                    }
                                } else {
                                    log.warn("Từ chối subscribe topic: {} do chưa xác thực", destination);
                                    throw new IllegalArgumentException("Người dùng chưa được xác thực");
                                }
                            } catch (IllegalArgumentException e) {
                                log.error("Từ chối subscribe: {} | Lỗi: {}", destination, e.getMessage());
                                throw e;
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}