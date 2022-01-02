package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static mh.michael.monopolybanking.util.Constants.*;

@Service
@Slf4j
public class GameService {
    private final GameRepository gameRepository;
    private final MoneySinkRepository moneySinkRepository;

    public GameService(GameRepository gameRepository, MoneySinkRepository moneySinkRepository) {
        this.gameRepository = gameRepository;
        this.moneySinkRepository = moneySinkRepository;
    }

    @Transactional
    public GameDTO createGame() {
        Game newGame = Game.builder()
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

        moneySinkRepository.save(bank);
        moneySinkRepository.save(freeParking);

        List<MoneySink> moneySinkList = moneySinkRepository.findAllByGameId(savedGame.getId());

        savedGame.setMoneySinks(moneySinkList);

        return ConvertDTOUtil.convertGameToGameDTO(savedGame);
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

    @Transactional
    public GameDTO getGameByCode(String gameCode) {
        Game game = gameRepository.findByCode(gameCode);
        if (game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }
        return ConvertDTOUtil.convertGameToGameDTO(game);
    }
}
