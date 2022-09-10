package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.util.OptionalUtil;
import mh.michael.monopolybanking.util.UserRole;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static mh.michael.monopolybanking.util.Constants.CODE_LENGTH;
import static mh.michael.monopolybanking.util.Constants.STARTING_MONEY_AMT;

@Service
@Slf4j
public class UserService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public UserService(
            GameRepository gameRepository,
            UserRepository userRepository,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public UserDTO createNewUser(long gameId, NewUserRequestDTO newUserRequestDTO) {
        UserRole newUserRole = newUserRequestDTO.getUserRole();
        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Game game = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                gameOpt,
                "Game not found",
                gameId
        );

        if (newUserRole.equals(UserRole.BANKER) && game.getUsers().stream().anyMatch(user -> user.getUserRole().equals(UserRole.BANKER.name()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This game already has a banker");
        }

        User newUser = User.builder()
                .game(game)
                .userRole(newUserRole.name())
                .moneyBalance(STARTING_MONEY_AMT)
                .name(newUserRequestDTO.getName())
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH).toUpperCase())
                .build();

        User updatedUser = userRepository.save(newUser);

        UserDTO updatedUserDTO = ConvertDTOUtil.convertUserToUserDTO(updatedUser);

        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/users", updatedUserDTO);

        return updatedUserDTO;
    }

    @Transactional
    public UserDTO getUserById(long userId) {
        Optional<User> foundUserOpt = userRepository.findById(userId);
        User foundUser = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                foundUserOpt,
                "User not found",
                userId
        );

        return ConvertDTOUtil.convertUserToUserDTO(foundUser);
    }

    @Transactional
    public UserDTO getUserByCodeAndGameId(long gameId, String userCode) {
        User foundUser = userRepository.findByGame_IdAndCode(gameId, userCode.toUpperCase());
        if (foundUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return ConvertDTOUtil.convertUserToUserDTO(foundUser);
    }

    @Transactional
    public List<UserDTO> getUsersByGameId(long gameId) {
        List<User> userList = userRepository.findAllByGameId(gameId);
        return ConvertDTOUtil.convertUserListToUserDTOList(userList);
    }
}
