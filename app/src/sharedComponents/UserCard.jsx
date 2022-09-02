import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormFeedback,
    Label,
    Input,
    Alert,
    Container,
    Row,
    Col
} from "reactstrap";

class UserCard extends PureComponent {
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
            const result = await this.props.payFunc(this.props.user.userId, this.state.amountToPay, false);
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
        const { user, isYou, showPay } = this.props;
        const { name, code, userRole, moneyBalance } = user;
        return (
            <>
                <Card color={isYou ? "info" : "light"}>
                    <CardBody>
                        <Container>
                            <Row>
                                <Col>
                                    <CardTitle tag="h4">
                                        {isYou && (
                                            `${name} (YOU)`
                                        )}
                                        {!isYou && (
                                            name
                                        )}
                                    </CardTitle>
                                    <CardSubtitle tag="h5" className="mb-2 text-muted">
                                        {code}
                                    </CardSubtitle>
                                </Col>
                                {showPay && !isYou && (
                                    <Col className="align-right">
                                        <div>
                                            <Button color="primary" onClick={this.togglePayModal}>Pay</Button>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                            <Row>
                                <Col>
                                    <div>
                                        Role: {userRole}
                                    </div>
                                    <div>
                                        Balance: {moneyBalance}
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.isPayModalOpen} toggle={this.togglePayModal}>
                    <ModalHeader toggle={this.togglePayModal}>Pay {name}</ModalHeader>
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

UserCard.defaultProps = {
    isYou: false,
    showPay: true,
    payFunc: () => { /* noop */ }
};

UserCard.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        userRole: PropTypes.string.isRequired,
        moneyBalance: PropTypes.number.isRequired
    }).isRequired,
    isYou: PropTypes.bool,
    showPay: PropTypes.bool,
    payFunc: PropTypes.func,
};

export default UserCard;
