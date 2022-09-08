package mh.michael.monopolybanking.util;

import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.dto.MoneySinkDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ConvertDTOUtil {
    private ConvertDTOUtil() {}

    public static UserDTO convertUserToUserDTO(User user) {
        return UserDTO.builder()
                .gameId(user.getGame().getId())
                .code(user.getCode())
                .moneyBalance(user.getMoneyBalance())
                .name(user.getName())
                .id(user.getId())
                .userRole(user.getUserRole())
                .build();
    }

    public static List<UserDTO> convertUserListToUserDTOList(List<User> userList) {
        return userList.stream().map(ConvertDTOUtil::convertUserToUserDTO).collect(Collectors.toList());
    }

    public static MoneySinkDTO convertMoneySinkToMoneySinkDTO(MoneySink moneySink) {
        return MoneySinkDTO.builder()
                .gameId(moneySink.getGame().getId())
                .moneyBalance(moneySink.getMoneyBalance())
                .id(moneySink.getId())
                .name(moneySink.getSinkName())
                .build();
    }

    public static List<MoneySinkDTO> convertMoneySinkListToMoneySinkDTOList(List<MoneySink> moneySinkList) {
        return moneySinkList.stream().map(ConvertDTOUtil::convertMoneySinkToMoneySinkDTO).collect(Collectors.toList());
    }

    public static GameDTO convertGameToGameDTO(Game game) {
        return GameDTO.builder()
                .gameId(game.getId())
                .users(game.getUsers() != null ? convertUserListToUserDTOList(game.getUsers()) : new ArrayList<>())
                .moneySinks(game.getMoneySinks() != null ? convertMoneySinkListToMoneySinkDTOList(game.getMoneySinks()) : new ArrayList<>())
                .code(game.getCode())
                .build();
    }

    public static List<GameDTO> convertGameListToGameDTOList(List<Game> gameList) {
        return gameList.stream().map(ConvertDTOUtil::convertGameToGameDTO).collect(Collectors.toList());
    }
}
