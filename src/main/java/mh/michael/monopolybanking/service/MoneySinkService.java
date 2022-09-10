package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.MoneySinkDTO;
import mh.michael.monopolybanking.dto.NewMoneySinkRequestDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import mh.michael.monopolybanking.util.OptionalUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class MoneySinkService {
    private final GameRepository gameRepository;
    private final MoneySinkRepository moneySinkRepository;

    public MoneySinkService(GameRepository gameRepository, MoneySinkRepository moneySinkRepository) {
        this.gameRepository = gameRepository;
        this.moneySinkRepository = moneySinkRepository;
    }

    @Transactional
    public MoneySinkDTO createMoneySink(long gameId, NewMoneySinkRequestDTO newMoneySinkRequestDTO) {
        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Game game = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                gameOpt,
                "Game not found",
                gameId
        );

        MoneySink newMoneySink = MoneySink.builder()
                .isBank(false)
                .sinkName(newMoneySinkRequestDTO.getSinkName())
                .moneyBalance(newMoneySinkRequestDTO.getMoneyBalance())
                .game(game)
                .build();
        MoneySink updatedMoneySink = moneySinkRepository.save(newMoneySink);
        return ConvertDTOUtil.convertMoneySinkToMoneySinkDTO(updatedMoneySink);
    }

    @Transactional
    public MoneySinkDTO getMoneySinkById(long sinkId) {
        Optional<MoneySink> foundSinkOpt = moneySinkRepository.findById(sinkId);
        MoneySink foundSink = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                foundSinkOpt,
                "Money sink not found",
                sinkId
        );

        return ConvertDTOUtil.convertMoneySinkToMoneySinkDTO(foundSink);
    }

    @Transactional
    public List<MoneySinkDTO> getMoneySinksByGameId(long gameId) {
        List<MoneySink> moneySinkList = moneySinkRepository.findAllByGameId(gameId);
        return ConvertDTOUtil.convertMoneySinkListToMoneySinkDTOList(moneySinkList);
    }
}
