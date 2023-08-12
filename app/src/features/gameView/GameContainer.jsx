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

        this.stompClient = null;
    }

    componentDidMount() {
        this.stompClient = stompClient();

        const componentThis = this;
        this.stompClient.onConnect = function (_frame) {
            componentThis.stompClient.subscribe(`${TOPIC_GAME_PREFIX}/${componentThis.props.activeGameId}/${TOPIC_GAME_PLAYERS}`, (message) => {
                // called when the client receives a STOMP message from the server
                if (message.body) {
                    componentThis.props.actions.playerReceivedFromWs(JSON.parse(message.body));
                } else {
                    console.log('got empty message');
                }
            });

            componentThis.stompClient.subscribe(`${TOPIC_GAME_PREFIX}/${componentThis.props.activeGameId}/${TOPIC_GAME_PAYMENT}`, (message) => {
                // called when the client receives a STOMP message from the server
                if (message.body) {
                    componentThis.props.actions.paymentReceivedFromWs(JSON.parse(message.body));
                } else {
                    console.log('got empty message');
                }
            });
        };

        this.stompClient.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        this.stompClient.activate();
    }

    componentWillUnmount() {
        this.stompClient.deactivate();
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
