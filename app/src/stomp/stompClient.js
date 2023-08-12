import { Client } from '@stomp/stompjs';
import { TOKEN_SESSION_ATTRIBUTE_NAME } from "../constants/general";

const singleStompClient = new Client({
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000
});

export const stompClient = () => {
    const colonIndex = window.location.host.indexOf(":");
    let hostName = window.location.host;
    
    // Check for front-end running in dev mode
    if (colonIndex >= 0 && window.location.host.substring(colonIndex) === ":3000") {
        hostName = `${window.location.host.slice(0, colonIndex)}:8080`;
    }

    const wsSourceUrl = "ws://" + hostName + "/ws";
    const token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);

    singleStompClient.brokerURL = wsSourceUrl;
    singleStompClient.connectHeaders = {
        authorization: token
    };

    return singleStompClient;
};

export const updateStompClientAuthTokenFromStorage = () => {
    const token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);

    singleStompClient.connectHeaders = {
        authorization: token
    };

    return singleStompClient;
};
