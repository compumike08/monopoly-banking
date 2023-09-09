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
    Button,
    Badge
} from "reactstrap";
import { formatNumberAsCurrency } from "../utils/util";

const PropertyCard = ({
    showCardHeader,
    showBuyButton,
    showMortgageButton,
    propertyData,
    buyPropertyFunction,
    mortgagePropertyFunction,
    loggedInPlayerId
}) => {
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
        isMortgaged,
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

    const isShowBuyButton = showBuyButton && !ownedByPlayerId;
    const isShowMortgageButton = showMortgageButton && loggedInPlayerId === ownedByPlayerId && !isMortgaged;

    return (
        <Card>
            <CardBody>
                <Container>
                    {showCardHeader && (
                        <Row>
                            <Col>
                                <CardTitle tag="h4">
                                    {name} {isMortgaged ? <Badge color="dark" className="ms-2">Mortgaged</Badge> : ""}
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
                    {(isShowBuyButton || isShowMortgageButton) && (
                        <Row>
                            <Col>
                                {isShowBuyButton && (
                                    <Button color="primary" onClick={() => buyPropertyFunction(propertyClaimId)}>Buy</Button>
                                )}
                                {isShowMortgageButton && (
                                    <Button color="primary" onClick={() => mortgagePropertyFunction(propertyClaimId)}>Mortgage</Button>
                                )}
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
    showMortgageButton: false,
    showCardHeader: true,
    buyPropertyFunction: () => { /* noop */ },
    mortgagePropertyFunction: () => { /* noop */ }
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
    loggedInPlayerId: PropTypes.number.isRequired,
    showBuyButton: PropTypes.bool,
    showMortgageButton: PropTypes.bool,
    showCardHeader: PropTypes.bool,
    buyPropertyFunction: PropTypes.func,
    mortgagePropertyFunction: PropTypes.func
};

export default PropertyCard;
