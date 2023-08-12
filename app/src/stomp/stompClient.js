import { Client } from '@stomp/stompjs';

export const stompClient = new Client({
    debug: function (str) {
        console.log(str);
    },
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000
});
