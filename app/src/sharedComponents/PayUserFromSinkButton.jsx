import React, { PureComponent } from "react";
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
    FormGroup,
    FormFeedback,
    ModalFooter
} from "reactstrap";
import { sendPaymentAction } from "../features/games/gamesSlice";

class PayUserFromSinkButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showPayModal: false,
            isResponseError: false,
            responseErrorMsg: null,
            fromSinkId: props.moneySinks.length > 0 ? props.moneySinks[0].id : null,
            isFromSinkIdValid: true,
            toUserId: props.users.length > 0 ? props.users[0].id : null,
            isToUserIdValid: true,
            amountToPay: null,
            isAmountToPayValid: true
        };
    }

    togglePayModal = () => {
        this.setState({
            showPayModal: !this.state.showPayModal
        });
    };

    clearError = () => {
        this.setState({
            isResponseError: false,
            responseErrorMsg: null
        });
    };

    handleFromSinkSelectChange = event => {
        const { target } = event;
        const { value } = target;

        this.setState({
            fromSinkId: value
        });
    };

    handleToUserSelectChange = event => {
        const { target } = event;
        const { value } = target;

        this.setState({
            toUserId: value
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
            isFromSinkIdValid: isValid,
            isToUserIdValid: isValid,
            isAmountToPayValid: isValid
        });

        if (!this.state.fromSinkId) {
            isValid = false;
            this.setState({
                isFromSinkIdValid: false
            });
        }

        if (!this.state.toUserId) {
            isValid = false;
            this.setState({
                isToUserIdValid: false
            })
        }

        if (!this.state.amountToPay) {
            isValid = false;
            this.setState({
                isAmountToPayValid: false
            });
        }

        if (isValid) {
            const { gameId, loggedInUserId } = this.props;
            const fromSink = this.props.moneySinks.find(sink => sink.id === parseInt(this.state.fromSinkId));
            const toUser = this.props.users.find(user => user.id === parseInt(this.state.toUserId));
            
            const data = {
                gameId,
                payRequestUUID: uuid(),
                fromId: fromSink.id,
                toId: toUser.id,
                requestInitiatorUserId: loggedInUserId,
                isFromSink: true,
                isToSink: false,
                amountToPay: parseInt(this.state.amountToPay),
                originalFromAmount: fromSink.moneyBalance,
                originalToAmount: toUser.moneyBalance
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

    render() {
        const { moneySinks, users } = this.props;
        return (
            <>
                <div>
                    <Button color="primary" onClick={this.togglePayModal}>Pay User From Money Sink</Button>
                </div>
                {this.state.showPayModal && (
                    <Modal isOpen={this.state.showPayModal} toggle={this.togglePayModal}>
                        <ModalHeader toggle={this.togglePayModal}>Pay User From Money Sink</ModalHeader>
                        <ModalBody>
                            <Alert color="danger" isOpen={this.state.isResponseError} toggle={this.clearError}>
                                {this.state.responseErrorMsg}
                            </Alert>
                            <FormGroup>
                                <Label for="fromSinkSelectInput">
                                    Pay From Money Sink
                                </Label>
                                <Input
                                    id="fromSinkSelectInput"
                                    name="fromSinkSelectInput"
                                    type="select"
                                    onChange={e => this.handleFromSinkSelectChange(e)}
                                    valid={this.state.isFromSinkIdValid}
                                    invalid={!this.state.isFromSinkIdValid}
                                >
                                    {moneySinks.map(sink => {
                                        return (
                                            <option value={sink.id}>
                                                {sink.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                                <FormFeedback>
                                    Pay From Money Sink is required.
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="toUserSelectInput">
                                    Pay To User
                                </Label>
                                <Input
                                    id="toUserSelectInput"
                                    name="toUserSelectInput"
                                    type="select"
                                    onChange={e => this.handleToUserSelectChange(e)}
                                    valid={this.state.isToUserIdValid}
                                    invalid={!this.state.isToUserIdValid}
                                >
                                    {users.map(user => {
                                        return (
                                            <option value={user.id}>
                                                {user.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                                <FormFeedback>
                                    Pay To User is required.
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
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
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.submitPayment}>Pay</Button>
                            <Button color="secondary" onClick={this.togglePayModal}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameId: state.gamesData.activeGame.gameId,
        moneySinks: state.gamesData.activeGame.moneySinks,
        users: state.gamesData.activeGame.users,
        loggedInUserId: state.gamesData.activeGame.loggedInUserId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({
            sendPaymentAction
        }, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayUserFromSinkButton);
