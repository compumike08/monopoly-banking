import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';
import SockJsClient from 'react-stomp';
import { TOPIC_GAME_PREFIX, TOPIC_GAME_USERS, TOPIC_GAME_PAYMENT } from "../../constants/general";
import { userReceivedFromWs, paymentReceivedFromWs } from "../games/gamesSlice";
import GameView from "./GameView";

import 'react-toastify/dist/ReactToastify.css';

class GameContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            wsClientConnected: false
        }
    }

    onWsMessageReceive = (msg, topic) => {
        if (topic === `${TOPIC_GAME_PREFIX}/${this.props.activeGameId}/${TOPIC_GAME_USERS}`) {
            this.props.actions.userReceivedFromWs(msg);
        } else if (topic === `${TOPIC_GAME_PREFIX}/${this.props.activeGameId}/${TOPIC_GAME_PAYMENT}`) {
            this.props.actions.paymentReceivedFromWs(msg);
        }
    };

    render() {
        const wsSourceUrl = window.location.protocol + "//" + window.location.host + "/ws";
        return (
            <>
                <ToastContainer
                    hideProgressBar
                    newestOnTop
                    limit={3}
                />
                <GameView />
                <SockJsClient
                    url={wsSourceUrl}
                    topics={[
                        `${TOPIC_GAME_PREFIX}/${this.props.activeGameId}/${TOPIC_GAME_USERS}`,
                        `${TOPIC_GAME_PREFIX}/${this.props.activeGameId}/${TOPIC_GAME_PAYMENT}`
                    ]}
                    onConnect={() => { this.setState({ wsClientConnected: true }) }}
                    onDisconnect={() => { this.setState({ wsClientConnected: false }) }}
                    onMessage={this.onWsMessageReceive}
                    ref={client => this.clientRef = client}
                    debug={false}
                />
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
            userReceivedFromWs,
            paymentReceivedFromWs
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
