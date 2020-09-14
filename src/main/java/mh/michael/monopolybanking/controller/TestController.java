package mh.michael.monopolybanking.controller;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.model.UserRole;
import mh.michael.monopolybanking.repository.GameRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.webjars.NotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/")
@Slf4j
public class TestController {
    private final GameRepository gameRepository;

    public TestController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @GetMapping("/test")
    public GameDTO test() {
        Game startGame = gameRepository.save(Game.builder().build());
        User newUser = User.builder()
                .code("ABC")
                .name("Mike")
                .moneyBalance(100)
                .userRole(UserRole.BANKER)
                .game(startGame)
                .build();
        List<User> newUserList = new ArrayList<>();
        newUserList.add(newUser);

        Game newGame = Game.builder()
                .users(newUserList)
                .moneySinks(new ArrayList<>())
                .build();
        Game savedGame = gameRepository.save(newGame);

        Game updatedGame = gameRepository.findById(savedGame.getId()).orElseThrow(() -> new NotFoundException("game not found"));

        List<UserDTO> userDtoList = updatedGame.getUsers().stream().map(user -> UserDTO.builder().userRole(user.getUserRole()).userId(user.getId()).name(user.getName()).moneyBalance(user.getMoneyBalance()).code(user.getCode()).gameId(updatedGame.getId()).build()).collect(Collectors.toList());

        return GameDTO.builder()
                .gameId(updatedGame.getId())
                .users(userDtoList)
                .build();
    }

    @GetMapping("/test2/{game_id}")
    public List<UserDTO> test2(@PathVariable("game_id") long gameId) {
        Game newGame = gameRepository.save(Game.builder().build());
        User newUser = User.builder()
                .code("DEF")
                .name("Jane")
                .moneyBalance(150)
                .userRole(UserRole.PLAYER)
                .game(newGame)
                .build();
        newGame.addUser(newUser);
        Game savedGame = gameRepository.save(newGame);

        log.info(String.valueOf(savedGame.getId()));

        return savedGame.getUsers().stream().map(user ->
                UserDTO.builder()
                        .gameId(user.getGame().getId())
                        .code(user.getCode())
                        .moneyBalance(user.getMoneyBalance())
                        .name(user.getName())
                        .userId(user.getId())
                        .userRole(user.getUserRole())
                        .build())
                .collect(Collectors.toList());
    }
}
