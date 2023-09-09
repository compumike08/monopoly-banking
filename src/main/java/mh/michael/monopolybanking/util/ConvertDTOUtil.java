package mh.michael.monopolybanking.util;

import mh.michael.monopolybanking.constants.PlayerRole;
import mh.michael.monopolybanking.dto.*;
import mh.michael.monopolybanking.model.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ConvertDTOUtil {
    private ConvertDTOUtil() {}

    public static PlayerDTO convertPlayerToPlayerDTO(Player player) {
        return PlayerDTO.builder()
                .gameId(player.getGame().getId())
                .code(player.getCode())
                .moneyBalance(player.getMoneyBalance())
                .name(player.getName())
                .id(player.getId())
                .playerRole(PlayerRole.valueOf(player.getPlayerRole()))
                .ownedPropertyClaimList(ConvertDTOUtil
                        .convertPropertyClaimListToPropertyClaimDTOList(player.getOwnedPropertyClaims()))
                .build();
    }

    public static List<PlayerDTO> convertPlayerListToPlayerDTOList(List<Player> playerList) {
        return playerList.stream().map(ConvertDTOUtil::convertPlayerToPlayerDTO).collect(Collectors.toList());
    }

    public static MoneySinkDTO convertMoneySinkToMoneySinkDTO(MoneySink moneySink) {
        return MoneySinkDTO.builder()
                .gameId(moneySink.getGame().getId())
                .moneyBalance(moneySink.getMoneyBalance())
                .id(moneySink.getId())
                .name(moneySink.getSinkName())
                .isBank(moneySink.getIsBank())
                .build();
    }

    public static List<MoneySinkDTO> convertMoneySinkListToMoneySinkDTOList(List<MoneySink> moneySinkList) {
        return moneySinkList.stream().map(ConvertDTOUtil::convertMoneySinkToMoneySinkDTO).collect(Collectors.toList());
    }

    public static GameDTO convertGameToGameDTO(Game game) {
        return GameDTO.builder()
                .gameId(game.getId())
                .players(game.getPlayers() != null ? convertPlayerListToPlayerDTOList(game.getPlayers()) : new ArrayList<>())
                .moneySinks(game.getMoneySinks() != null ? convertMoneySinkListToMoneySinkDTOList(game.getMoneySinks()) : new ArrayList<>())
                .code(game.getCode())
                .isCollectFromFreeParking(game.getIsCollectFromFreeParking())
                .build();
    }

    public static List<GameDTO> convertGameListToGameDTOList(List<Game> gameList) {
        return gameList.stream().map(ConvertDTOUtil::convertGameToGameDTO).collect(Collectors.toList());
    }

    public static PayResponseDTO convertPaymentToPayResponseDTO(Payment payment) {
        return PayResponseDTO.builder()
                .amountPaid(payment.getAmountPaid())
                .fromMoneySink(payment.getFromMoneySink() != null ? convertMoneySinkToMoneySinkDTO(payment.getFromMoneySink()) : null)
                .fromPlayer(payment.getFromPlayer() != null ? convertPlayerToPlayerDTO(payment.getFromPlayer()) : null)
                .gameId(payment.getGame().getId())
                .isFromSink(payment.getIsFromSink())
                .isToSink(payment.getIsToSink())
                .payRequestUUID(payment.getPayRequestUuid())
                .requestInitiatorPlayerId(payment.getRequesterPlayer().getId())
                .toMoneySink(payment.getToMoneySink() != null ? convertMoneySinkToMoneySinkDTO(payment.getToMoneySink()) : null)
                .toPlayer(payment.getToPlayer() != null ? convertPlayerToPlayerDTO(payment.getToPlayer()) : null)
                .build();
    }

    public static List<PayResponseDTO> convertPaymentListToPayResponseDTOList(List<Payment> paymentList) {
        return paymentList.stream().map(ConvertDTOUtil::convertPaymentToPayResponseDTO).collect(Collectors.toList());
    }

    public static UserDTO convertUserToUserDTO(User user) {
        return UserDTO.builder()
                .email(user.getEmail())
                .roles(user.getRoles().parallelStream().map(UserRole::getName).collect(Collectors.toSet()))
                .username(user.getUsername())
                .userUuid(user.getUserUuid().toString())
                .build();
    }

    public static List<PropertyClaimDTO> convertPropertyClaimListToPropertyClaimDTOList(
            List<PropertyClaim> propertyClaimList
    ) {
        return propertyClaimList.stream()
                .map(ConvertDTOUtil::convertPropertyClaimToPropertyClaimDTO).collect(Collectors.toList());
    }

    public static PropertyClaimDTO convertPropertyClaimToPropertyClaimDTO(PropertyClaim propertyClaim) {
        return PropertyClaimDTO.builder()
                .ownedByPlayerId(propertyClaim.getOwnedByPlayer() != null ?
                        propertyClaim.getOwnedByPlayer().getId() : null)
                .ownedByPlayerName(propertyClaim.getOwnedByPlayer() != null ?
                        propertyClaim.getOwnedByPlayer().getName() : null)
                .buildingCost(propertyClaim.getProperty().getBuildingCost())
                .rentForColorGroup(propertyClaim.getProperty().getRentForColorGroup())
                .rentForSite(propertyClaim.getProperty().getRentForSite())
                .color(propertyClaim.getProperty().getColor())
                .cost(propertyClaim.getProperty().getCost())
                .rentOneHouseOrRailroad(propertyClaim.getProperty().getRentOneHouseOrRailroad())
                .gameId(propertyClaim.getGame().getId())
                .propertyClaimId(propertyClaim.getId())
                .isRailroad(propertyClaim.getProperty().getIsRailroad())
                .isRegularProperty(propertyClaim.getProperty().getIsRegularProperty())
                .isUtility(propertyClaim.getProperty().getIsUtility())
                .isMortgaged(propertyClaim.getIsMortgaged())
                .mortgageValue(propertyClaim.getProperty().getMortgageValue())
                .name(propertyClaim.getProperty().getName())
                .rentFourHouseOrRailroad(propertyClaim.getProperty().getRentFourHouseOrRailroad())
                .rentHotel(propertyClaim.getProperty().getRentHotel())
                .rentThreeHouseOrRailroad(propertyClaim.getProperty().getRentThreeHouseOrRailroad())
                .rentTwoHouseOrRailroad(propertyClaim.getProperty().getRentTwoHouseOrRailroad())
                .unmortgageValue(propertyClaim.getProperty().getUnmortgageValue())
                .unmortgageValue(propertyClaim.getProperty().getUnmortgageValue())
                .build();
    }
}
