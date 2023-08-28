import React from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Container,
    Row,
    Col,
    Button
} from "reactstrap";
import { formatNumberAsCurrency } from "../utils/util";

const PropertyCard = ({ showCardHeader, showBuyButton, propertyData, buyPropertyFunction }) => {
    const {
        propertyClaimId,
        name,
        cost,
        isRegularProperty,
        rentForSite,
        rentForColorGroup,
        rentOneHouseOrRailroad,
        rentTwoHouseOrRailroad,
        rentThreeHouseOrRailroad,
        rentFourHouseOrRailroad,
        rentHotel,
        mortgageValue,
        unmortgageValue,
        ownedByPlayerName,
        ownedByPlayerId,
        isRailroad,
        isUtility
    } = propertyData;

    const formattedCost = formatNumberAsCurrency(cost);
    const formattedRentForSite = rentForSite ? formatNumberAsCurrency(rentForSite) : "";
    const formattedRentForColorGroup = rentForColorGroup ? formatNumberAsCurrency(rentForColorGroup) : "";
    const formattedRentOneHouseOrRailroad = rentOneHouseOrRailroad ? formatNumberAsCurrency(rentOneHouseOrRailroad) : "";
    const formattedRentTwoHouseOrRailroad = rentTwoHouseOrRailroad ? formatNumberAsCurrency(rentTwoHouseOrRailroad) : "";
    const formattedRentThreeHouseOrRailroad = rentThreeHouseOrRailroad ? formatNumberAsCurrency(rentThreeHouseOrRailroad) : "";
    const formattedRentFourHouseOrRailroad = rentFourHouseOrRailroad ? formatNumberAsCurrency(rentFourHouseOrRailroad) : "";
    const formattedRentHotel = rentHotel ? formatNumberAsCurrency(rentHotel) : "";
    const formattedMortgageValue = formatNumberAsCurrency(mortgageValue);
    const formattedUnmortgageValue = formatNumberAsCurrency(unmortgageValue);

    return (
        <Card>
            <CardBody>
                <Container>
                    {showCardHeader && (
                        <Row>
                            <Col>
                                <CardTitle tag="h4">
                                    {name}
                                </CardTitle>
                                <CardSubtitle tag="h5">
                                    Purchase Cost: {formattedCost}
                                </CardSubtitle>
                            </Col>
                        </Row>
                    )}
                    {isRegularProperty && (
                        <Row>
                            <Col>
                                <div>
                                    Rent: {formattedRentForSite}
                                </div>
                                <div>
                                    Rent if all color group owned (no houses): {formattedRentForColorGroup}
                                </div>
                                <div>
                                    Rent w/ 1 House: {formattedRentOneHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 2 Houses: {formattedRentTwoHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 3 Houses: {formattedRentThreeHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 4 Houses: {formattedRentFourHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ Hotel: {formattedRentHotel}
                                </div>
                            </Col>
                        </Row>
                    )}
                    {isRailroad && (
                        <Row>
                            <Col>
                                <div>
                                    Rent w/ 1 Railroad Owned: {formattedRentOneHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 2 Railroads Owned: {formattedRentTwoHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 3 Railroads Owned: {formattedRentThreeHouseOrRailroad}
                                </div>
                                <div>
                                    Rent w/ 4 Railroads Owned: {formattedRentFourHouseOrRailroad}
                                </div>
                            </Col>
                        </Row>
                    )}
                    {isUtility && (
                        <Row>
                            <Col>
                                <div>
                                    Rent w/ 1 Utility Owned: 4 times amount shown on dice
                                </div>
                                <div>
                                    Rent w/ 2 Utilities Owned: 10 times amount shown on dice
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col>
                            <div>
                                Mortgage Value: {formattedMortgageValue}
                            </div>
                            <div>
                                Cost to Unmortgage: {formattedUnmortgageValue}
                            </div>
                        </Col>
                    </Row>
                    {ownedByPlayerName && ownedByPlayerName.length > 0 && (
                        <Row>
                            <Col>
                                <div>
                                    Owned By: {ownedByPlayerName}
                                </div>
                            </Col>
                        </Row>
                    )}
                    {showBuyButton && !ownedByPlayerId && (
                        <Row>
                            <Col>
                                <div>
                                    <Button color="primary" onClick={() => buyPropertyFunction(propertyClaimId)}>Buy</Button>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </CardBody>
        </Card>
    );
};

PropertyCard.defaultProps = {
    showBuyButton: false,
    showCardHeader: true,
    buyPropertyFunction: () => { /* noop */ }
};

PropertyCard.propTypes = {
    propertyData: PropTypes.shape({
        propertyClaimId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired,
        color: PropTypes.string,
        rentForSite: PropTypes.number,
        rentForColorGroup: PropTypes.number,
        rentOneHouseOrRailroad: PropTypes.number,
        rentTwoHouseOrRailroad: PropTypes.number,
        rentThreeHouseOrRailroad: PropTypes.number,
        rentFourHouseOrRailroad: PropTypes.number,
        rentHotel: PropTypes.number,
        buildingCost: PropTypes.number,
        mortgageValue: PropTypes.number.isRequired,
        unmortgageValue: PropTypes.number.isRequired,
        isRegularProperty: PropTypes.bool.isRequired,
        isRailroad: PropTypes.bool.isRequired,
        isUtility: PropTypes.bool.isRequired,
        gameId: PropTypes.number.isRequired,
        ownedByPlayerId: PropTypes.number,
        ownedByPlayerName: PropTypes.string
    }).isRequired,
    showBuyButton: PropTypes.bool,
    showCardHeader: PropTypes.bool,
    buyPropertyFunction: PropTypes.func
};

export default PropertyCard;
