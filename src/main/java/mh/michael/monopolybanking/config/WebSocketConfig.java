package mh.michael.monopolybanking.config;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.security.JwtTokenUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final String STOMP_TOKEN_AUTHORIZATION_HEADER_NAME = "authorization";
    private static final String TOKEN_INVALID_MSG_STRING = "Token invalid";
    private static final String TOKEN_EXPIRED_MSG_STRING = "Token expired";

    private final UserDetailsService databaseAuthUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    public WebSocketConfig(
            UserDetailsService databaseAuthUserDetailsService,
            JwtTokenUtil jwtTokenUtil
    ) {
        this.databaseAuthUserDetailsService = databaseAuthUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    boolean isAuthSuccess = false;
                    log.debug("Authentication Request For Websocket '{}'", accessor.getDestination());

                    final String requestTokenHeader = accessor.getNativeHeader(STOMP_TOKEN_AUTHORIZATION_HEADER_NAME).get(0);

                    String username = null;
                    String jwtToken = null;
                    if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
                        jwtToken = requestTokenHeader.substring(7);
                        try {
                            username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                        } catch (IllegalArgumentException e) {
                            log.error("JWT_TOKEN_UNABLE_TO_GET_USERNAME", e);
                            throw new MessagingException(TOKEN_INVALID_MSG_STRING);
                        } catch (ExpiredJwtException e) {
                            log.warn("JWT_TOKEN_EXPIRED", e);
                            throw new MessagingException(TOKEN_EXPIRED_MSG_STRING);
                        }
                    } else {
                        log.warn("JWT_TOKEN_DOES_NOT_START_WITH_BEARER_STRING");
                    }

                    log.debug("JWT_TOKEN_USERNAME_VALUE '{}'", username);
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                        UserDetails userDetails = databaseAuthUserDetailsService.loadUserByUsername(username);

                        if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                            accessor.setUser(usernamePasswordAuthenticationToken);
                            isAuthSuccess = true;
                        }
                    }

                    if (!isAuthSuccess) {
                        log.warn("Websocket auth token was not successfully validated");
                        throw new MessagingException("Access Denied");
                    }
                }
                return message;
            }
        });
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*");
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }
}
