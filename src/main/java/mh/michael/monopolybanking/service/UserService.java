package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.exception.EntityNotFoundException;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static mh.michael.monopolybanking.util.Constants.CODE_LENGTH;
import static mh.michael.monopolybanking.util.Constants.STARTING_MONEY_AMT;

@Service
@Slf4j
public class UserService {
    private final GameRepository gameRepository;

    public UserService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional
    public UserDTO createNewUser(long gameId, NewUserRequestDTO newUserRequestDTO) {
        Game game = gameRepository.getOne(gameId);
        User newUser = User.builder()
                .game(game)
                .userRole(newUserRequestDTO.getUserRole())
                .moneyBalance(STARTING_MONEY_AMT)
                .name(newUserRequestDTO.getName())
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH))
                .build();
        game.addUser(newUser);
        Game updatedGame = gameRepository.save(game);
        User updatedUser = updatedGame.getUsers().stream()
                .filter(user -> user.getCode().equals(newUser.getCode()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("user not found"));

        return ConvertDTOUtil.convertUserToUserDTO(updatedUser);
    }

    @Transactional
    public UserDTO getUserById(long gameId, long userId) {
        Game game = gameRepository.getOne(gameId);
        User foundUser = game.getUsers().stream().filter(user -> user.getId() == userId).findFirst().orElseThrow(() -> new EntityNotFoundException("user not found"));
        return ConvertDTOUtil.convertUserToUserDTO(foundUser);
    }

    @Transactional
    public List<UserDTO> getUsersByGameId(long gameId) {
        Game game = gameRepository.getOne(gameId);
        return ConvertDTOUtil.convertUserListToUserDTOList(game.getUsers());
    }
}
