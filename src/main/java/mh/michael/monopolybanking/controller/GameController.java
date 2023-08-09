package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.CreateNewGameDTO;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.dto.NewPlayerRequestDTO;
import mh.michael.monopolybanking.dto.PlayerDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.GameService;
import mh.michael.monopolybanking.service.PlayerService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;
    private final PlayerService playerService;

    public GameController(
            GameService gameService,
            PlayerService playerService
    ) {
        this.gameService = gameService;
        this.playerService = playerService;
    }

    @GetMapping("/list")
    public List<GameDTO> getAllGamesUserBelongsTo(@AuthenticationPrincipal JwtUserDetails jwtUserDetails) {
        return gameService.getAllGamesUserBelongsTo(jwtUserDetails);
    }

    @GetMapping("/game/{game_id}")
    public GameDTO getGameById(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("game_id") long gameId
    ) {
        return gameService.getGameById(gameId, jwtUserDetails);
    }

    // This endpoint allows any authenticated user to access any game by code;
    // authorization for a specific game is not required.
    @GetMapping("/gameCode/{game_code}")
    public GameDTO getGameByCode(@PathVariable("game_code") String gameCode) {
        return gameService.getGameByCode(gameCode);
    }

    @GetMapping("/game/{game_id}/player")
    public PlayerDTO getPlayerByCode(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("game_id") long gameId
    ) {
        return playerService.getPlayerByCodeAndGameId(gameId, jwtUserDetails);
    }

    @PostMapping("/createNewGame")
    public GameDTO createNewGame(@RequestBody CreateNewGameDTO createNewGameDTO) {
        return gameService.createGame(createNewGameDTO);
    }

    @PostMapping("/game/{game_id}/createNewPlayer")
    public PlayerDTO createNewPlayer(
            @PathVariable("game_id") long gameId,
            @RequestBody NewPlayerRequestDTO newPlayerRequestDTO,
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails
    ) {
        return playerService.createNewPlayer(gameId, newPlayerRequestDTO, jwtUserDetails);
    }
}
