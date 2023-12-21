import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, FormFeedback, Alert } from "reactstrap";
import { createNewGameAction } from "./gamesSlice";

const CONST_YES = "YES";
const CONST_NO = "NO";

class NewGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backendErrMsg: null,
            isFreeParkingRadioButtonsValid: true,
            isCollectFromFreeParking: null
        };
    }

    handleFreeParkingRadioChange = evt => {
        const { target } = evt;
        const { value } = target;

        const isCollectFromFreeParking = value === CONST_YES ? true : false;

        this.setState({
            isCollectFromFreeParking
        });
    };

    handleSubmit = async () => {
        let isValid = true;
        this.setState({
            isFreeParkingRadioButtonsValid: true
        });

        if (this.state.isCollectFromFreeParking !== false && this.state.isCollectFromFreeParking !== true) {
            isValid = false;
            this.setState({
                isFreeParkingRadioButtonsValid: false
            });
        }

        if (isValid) {
            const data = {
                isCollectFromFreeParking: this.state.isCollectFromFreeParking
            };
            
            try {
                await this.props.actions.createNewGameAction(data).unwrap();
                this.props.history.push('/newPlayer');
            } catch (err) {
                this.setState({
                    backendErrorMsg: err.message
                });
            }
        }
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <div className="glbl-heading">
                            New Game
                        </div>
                    </Col>
                </Row>
                {this.state.backendErrorMsg && (
                    <Row>
                        <Col>
                            <Alert color="danger">{this.state.backendErrorMsg}</Alert>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col mg="5">
                        <Form>
                            <FormGroup tag="fieldset">
                                <Label>
                                    Would you like to play a version of Monopoly where players landing on Free Parking collect the money there?
                                </Label>
                                <FormGroup check>
                                    <Input
                                        id="free-parking-yes-input"
                                        name="free-parking-input"
                                        type="radio"
                                        onChange={this.handleFreeParkingRadioChange}
                                        checked={this.state.isCollectFromFreeParking === true}
                                        value={CONST_YES}
                                        invalid={!this.state.isFreeParkingRadioButtonsValid}
                                    />
                                    {' '}
                                    <Label check for="free-parking-yes-input">
                                        Yes
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Input
                                        id="free-parking-no-input"
                                        name="free-parking-input"
                                        type="radio"
                                        onChange={this.handleFreeParkingRadioChange}
                                        checked={this.state.isCollectFromFreeParking === false}
                                        value={CONST_NO}
                                        invalid={!this.state.isFreeParkingRadioButtonsValid}
                                    />
                                    {' '}
                                    <Label check for="free-parking-no-input">
                                        No
                                    </Label>
                                    <FormFeedback>
                                        You must select either yes or no
                                    </FormFeedback>
                                </FormGroup>
                            </FormGroup>
                            <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createNewGameAction
        }, dispatch)
    };
};

export default withRouter(connect(undefined, mapDispatchToProps)(NewGame));
