package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.service.GameService;
import mh.michael.monopolybanking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;
    private final UserService userService;

    public GameController(
            GameService gameService,
            UserService userService
    ) {
        this.gameService = gameService;
        this.userService = userService;
    }

    @GetMapping("/list")
    public List<GameDTO> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/game/{game_id}")
    public GameDTO getGameById(@PathVariable("game_id") long gameId) {
        return gameService.getGameById(gameId);
    }

    @PostMapping("/createNewGame")
    public GameDTO createNewGame() {
        return gameService.createGame();
    }

    @PostMapping("/game/{game_id}/createNewUser")
    public UserDTO createNewUser(@PathVariable("game_id") long gameId, @RequestBody NewUserRequestDTO newUserRequestDTO) {
        return userService.createNewUser(gameId, newUserRequestDTO);
    }

}
