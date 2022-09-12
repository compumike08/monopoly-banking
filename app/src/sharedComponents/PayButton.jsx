import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { v4 as uuid } from "uuid";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Alert,
    Label,
    Input,
    FormFeedback,
    ModalFooter
} from "reactstrap";
import { selectLoggedInUser } from "../features/gameView/gameUsersSelector";
import { sendPaymentAction } from "../features/games/gamesSlice";

class PayButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPayModalOpen: false,
            amountToPay: null,
            isAmountToPayValid: true,
            isResponseError: false,
            responseErrorMsg: null
        };
    }

    togglePayModal = () => {
        this.clearError();
        this.setState({
            isPayModalOpen: !this.state.isPayModalOpen
        });
    };

    handleAmountToPayChange = event => {
        const { target } = event;
        const { value } = target;

        this.setState({
            amountToPay: value
        });
    };

    submitPayment = async () => {
        let isValid = true;
        this.clearError();
        this.setState({
            isAmountToPayValid: isValid
        });

        if (!this.state.amountToPay) {
            isValid = false;
            this.setState({
                isAmountToPayValid: isValid
            });
        }

        if (isValid) {
            const { gameId, loggedInUserId, userOrSink, isFromSink, fromSink, loggedInUserObject } = this.props;
            const toId = userOrSink.id;
            const data = {
                gameId,
                payRequestUUID: uuid(),
                fromId: loggedInUserId,
                toId,
                requestInitiatorUserId: loggedInUserId,
                isFromSink,
                isToSink: userOrSink.isSink,
                amountToPay: parseInt(this.state.amountToPay),
                originalFromAmount: !isFromSink ? loggedInUserObject.moneyBalance : fromSink.moneyBalance,
                originalToAmount: userOrSink.moneyBalance
            };

            const result = await this.props.actions.sendPaymentAction(data);
            if (result.error && result.error.message) {
                this.setState({
                    isResponseError: true,
                    responseErrorMsg: result.error.message
                });
            } else {
                this.togglePayModal();
            }
        }
    };

    clearError = () => {
        this.setState({
            isResponseError: false,
            responseErrorMsg: null
        });
    };

    render() {
        const { userOrSink } = this.props;

        return (
            <>
                <div>
                    <Button color="primary" onClick={this.togglePayModal}>Pay</Button>
                </div>
                <Modal isOpen={this.state.isPayModalOpen} toggle={this.togglePayModal}>
                    <ModalHeader toggle={this.togglePayModal}>Pay {userOrSink.name}</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.isResponseError} toggle={this.clearError}>
                            {this.state.responseErrorMsg}
                        </Alert>
                        <Label for="amountToPayInput">
                            Amount
                        </Label>
                        <Input
                            id="amountToPayInput"
                            name="amountToPayInput"
                            type="number"
                            onChange={e => this.handleAmountToPayChange(e)}
                            valid={this.state.isAmountToPayValid}
                            invalid={!this.state.isAmountToPayValid}
                        />
                        <FormFeedback>
                            Amount is required.
                        </FormFeedback>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitPayment}>Pay</Button>
                        <Button color="secondary" onClick={this.togglePayModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

PayButton.defaultProps = {
    isFromSink: false,
    fromSink: null
};

PayButton.propTypes = {
    gameId: PropTypes.number.isRequired,
    loggedInUserId: PropTypes.number.isRequired,
    userOrSink: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        isSink: PropTypes.bool.isRequired,
        moneyBalance: PropTypes.number.isRequired
    }).isRequired,
    isFromSink: PropTypes.bool,
    fromSink: PropTypes.shape({
        sinkId: PropTypes.number.isRequired,
        sinkName: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired
    })
};

const mapStateToProps = state => {
    return {
        loggedInUserObject: selectLoggedInUser(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({
            sendPaymentAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayButton);
