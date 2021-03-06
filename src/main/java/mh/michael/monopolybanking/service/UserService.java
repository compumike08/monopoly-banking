package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.model.UserRole;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static mh.michael.monopolybanking.util.Constants.CODE_LENGTH;
import static mh.michael.monopolybanking.util.Constants.STARTING_MONEY_AMT;

@Service
@Slf4j
public class UserService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public UserService(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDTO createNewUser(long gameId, NewUserRequestDTO newUserRequestDTO) {
        UserRole newUserRole = newUserRequestDTO.getUserRole();
        Game game = gameRepository.getOne(gameId);

        if (newUserRole.equals(UserRole.BANKER) && game.getUsers().stream().anyMatch(user -> user.getUserRole().equals(UserRole.BANKER))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This game already has a banker");
        }

        User newUser = User.builder()
                .game(game)
                .userRole(newUserRole)
                .moneyBalance(STARTING_MONEY_AMT)
                .name(newUserRequestDTO.getName())
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH))
                .build();

        User updatedUser = userRepository.save(newUser);

        return ConvertDTOUtil.convertUserToUserDTO(updatedUser);
    }

    @Transactional
    public UserDTO getUserById(long userId) {
        User foundUser = userRepository.getOne(userId);
        return ConvertDTOUtil.convertUserToUserDTO(foundUser);
    }

    @Transactional
    public List<UserDTO> getUsersByGameId(long gameId) {
        List<User> userList = userRepository.findAllByGameId(gameId);
        return ConvertDTOUtil.convertUserListToUserDTOList(userList);
    }
}
