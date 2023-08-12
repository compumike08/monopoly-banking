import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import { stompClient } from "../../stomp/stompClient";
import { TOPIC_GAME_PREFIX, TOPIC_GAME_PLAYERS, TOPIC_GAME_PAYMENT } from "../../constants/general";
import { playerReceivedFromWs, paymentReceivedFromWs } from "../games/gamesSlice";
import GameView from "./GameView";

import 'react-toastify/dist/ReactToastify.css';

class GameContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            wsClientConnected: false
        }
    }

    componentDidMount() {
        const colonIndex = window.location.host.indexOf(":");
        let hostName = window.location.host;
        
        // Check for front-end running in dev mode
        if (colonIndex >= 0 && window.location.host.substring(colonIndex) === ":3000") {
            hostName = `${window.location.host.slice(0, colonIndex)}:8080`;
        }

        const wsSourceUrl = "ws://" + hostName + "/ws";

        stompClient.brokerURL = wsSourceUrl;

        const componentThis = this;
        stompClient.onConnect = function (_frame) {
            stompClient.subscribe(`${TOPIC_GAME_PREFIX}/${componentThis.props.activeGameId}/${TOPIC_GAME_PLAYERS}`, (message) => {
                // called when the client receives a STOMP message from the server
                if (message.body) {
                    componentThis.props.actions.playerReceivedFromWs(JSON.parse(message.body));
                } else {
                    console.log('got empty message');
                }
            });

            stompClient.subscribe(`${TOPIC_GAME_PREFIX}/${componentThis.props.activeGameId}/${TOPIC_GAME_PAYMENT}`, (message) => {
                // called when the client receives a STOMP message from the server
                if (message.body) {
                    componentThis.props.actions.paymentReceivedFromWs(JSON.parse(message.body));
                } else {
                    console.log('got empty message');
                }
            });
        };

        stompClient.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        stompClient.activate();
    }

    componentWillUnmount() {
        stompClient.deactivate();
    }

    render() {
        return (
            <>
                <ToastContainer
                    hideProgressBar
                    newestOnTop
                    limit={3}
                />
                <GameView />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeGameId: state.gamesData.activeGame.gameId
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            playerReceivedFromWs,
            paymentReceivedFromWs
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
