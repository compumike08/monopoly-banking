package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static mh.michael.monopolybanking.util.Constants.*;

@Service
@Slf4j
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional
    public GameDTO createGame() {
        Game newGame = Game.builder()
                .users(new ArrayList<>())
                .moneySinks(new ArrayList<>())
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH))
                .build();
        Game savedGame = gameRepository.save(newGame);

        MoneySink bank = MoneySink.builder()
                .game(savedGame)
                .moneyBalance(INITIAL_BANK_AMT)
                .sinkName(BANK_MONEY_SINK_NAME)
                .isBank(true)
                .build();

        MoneySink freeParking = MoneySink.builder()
                .game(savedGame)
                .moneyBalance(0)
                .sinkName(FREE_PARKING_SINK_NAME)
                .isBank(false)
                .build();

        savedGame.addMoneySink(bank);
        savedGame.addMoneySink(freeParking);
        Game updatedGame = gameRepository.save(savedGame);

        return ConvertDTOUtil.convertGameToGameDTO(updatedGame);
    }

    @Transactional
    public List<GameDTO> getAllGames() {
        List<Game> gameList = gameRepository.findAll();
        return ConvertDTOUtil.convertGameListToGameDTOList(gameList);
    }

    @Transactional
    public GameDTO getGameById(long gameId) {
        Game game = gameRepository.getOne(gameId);
        return ConvertDTOUtil.convertGameToGameDTO(game);
    }
}
