package mh.michael.monopolybanking.util;

import mh.michael.monopolybanking.constants.PlayerRole;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.dto.MoneySinkDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.dto.PlayerDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.Payment;
import mh.michael.monopolybanking.model.Player;

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
}
