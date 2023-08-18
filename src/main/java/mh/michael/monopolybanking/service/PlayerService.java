package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.NewPlayerRequestDTO;
import mh.michael.monopolybanking.dto.PlayerDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.repository.UserRepository;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.OptionalUtil;
import mh.michael.monopolybanking.constants.PlayerRole;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.PlayerRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

import static mh.michael.monopolybanking.constants.Constants.CODE_LENGTH;
import static mh.michael.monopolybanking.constants.Constants.STARTING_MONEY_AMT;

@Service
@Slf4j
public class PlayerService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public PlayerService(
            GameRepository gameRepository,
            PlayerRepository playerRepository,
            UserRepository userRepository,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public PlayerDTO createNewPlayer(long gameId, NewPlayerRequestDTO newPlayerRequestDTO, JwtUserDetails jwtUserDetails) {
        PlayerRole newPlayerRole = newPlayerRequestDTO.getPlayerRole();
        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Game game = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                gameOpt,
                "Game not found",
                gameId
        );

        if (game.getPlayers().parallelStream()
                .anyMatch(player -> player.getUser().getId().equals(jwtUserDetails.getId()))
        ) {
            log.info("User attempted to join game as new player when user is already a different player in the game");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already are part of this game as a different player. Please go back and rejoin game as same player.");
        }

        User user = userRepository.getOne(jwtUserDetails.getId());

        if (newPlayerRole.equals(PlayerRole.BANKER) && game.getPlayers().stream()
                .anyMatch(player -> player.getPlayerRole().equals(PlayerRole.BANKER.name()))
        ) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This game already has a banker");
        }

        Player newPlayer = Player.builder()
                .game(game)
                .playerRole(newPlayerRole.name())
                .moneyBalance(STARTING_MONEY_AMT)
                .name(newPlayerRequestDTO.getName())
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH).toUpperCase())
                .ownedPropertyClaims(new ArrayList<>())
                .user(user)
                .build();

        Player updatedPlayer = playerRepository.save(newPlayer);

        PlayerDTO updatedPlayerDTO = ConvertDTOUtil.convertPlayerToPlayerDTO(updatedPlayer);

        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/players", updatedPlayerDTO);

        return updatedPlayerDTO;
    }

    @Transactional
    public PlayerDTO getPlayerById(long userId) {
        Optional<Player> foundUserOpt = playerRepository.findById(userId);
        Player foundPlayer = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                foundUserOpt,
                "Player not found",
                userId
        );

        return ConvertDTOUtil.convertPlayerToPlayerDTO(foundPlayer);
    }

    @Transactional
    public PlayerDTO getPlayerByCodeAndGameId(long gameId, JwtUserDetails jwtUserDetails) {
        if (jwtUserDetails.getGameIdList().parallelStream().noneMatch(thisGameId -> thisGameId.equals(gameId))) {
            log.error("User tried to re-join existing game that user is not part of");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Player foundPlayer = playerRepository.findByGame_IdAndUser_Id(gameId, jwtUserDetails.getId());

        if (foundPlayer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
        }

        return ConvertDTOUtil.convertPlayerToPlayerDTO(foundPlayer);
    }
}
