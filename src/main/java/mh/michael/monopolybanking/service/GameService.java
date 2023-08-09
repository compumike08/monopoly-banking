package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.CreateNewGameDTO;
import mh.michael.monopolybanking.dto.GameDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import mh.michael.monopolybanking.util.OptionalUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static mh.michael.monopolybanking.constants.Constants.*;

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
    public GameDTO createGame(CreateNewGameDTO createNewGameDTO) {
        Game newGame = Game.builder()
                .code(RandomStringUtils.randomAlphanumeric(CODE_LENGTH).toUpperCase())
                .isCollectFromFreeParking(createNewGameDTO.getIsCollectFromFreeParking())
                .build();
        Game savedGame = gameRepository.save(newGame);

        MoneySink bank = MoneySink.builder()
                .game(savedGame)
                .moneyBalance(INITIAL_BANK_AMT)
                .sinkName(BANK_MONEY_SINK_NAME)
                .isBank(true)
                .build();

        moneySinkRepository.save(bank);

        if (savedGame.getIsCollectFromFreeParking()) {
            MoneySink freeParking = MoneySink.builder()
                    .game(savedGame)
                    .moneyBalance(0)
                    .sinkName(FREE_PARKING_SINK_NAME)
                    .isBank(false)
                    .build();

            moneySinkRepository.save(freeParking);
        }

        List<MoneySink> moneySinkList = moneySinkRepository.findAllByGameId(savedGame.getId());

        savedGame.setMoneySinks(moneySinkList);

        return ConvertDTOUtil.convertGameToGameDTO(savedGame);
    }

    @Transactional
    public List<GameDTO> getAllGamesUserBelongsTo(JwtUserDetails jwtUserDetails) {
        List<Long> gameIdList = jwtUserDetails.getGameIdList();
        List<Game> gameList = gameRepository.findGamesByIdIn(gameIdList);
        return ConvertDTOUtil.convertGameListToGameDTOList(gameList);
    }

    @Transactional
    public GameDTO getGameById(long gameId, JwtUserDetails jwtUserDetails) {
        if (jwtUserDetails.getGameIdList().parallelStream().noneMatch(thisGameId -> thisGameId.equals(gameId))) {
            log.error("User attempted to access game by id for a game user does not belong to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Game game = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                gameOpt,
                "Game not found",
                gameId
        );

        return ConvertDTOUtil.convertGameToGameDTO(game);
    }

    @Transactional
    public GameDTO getGameByCode(String gameCode) {
        Game game = gameRepository.findByCode(gameCode.toUpperCase());
        if (game == null) {
            log.error("Game not found - code searched for: " + gameCode);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }
        return ConvertDTOUtil.convertGameToGameDTO(game);
    }
}
