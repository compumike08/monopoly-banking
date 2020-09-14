package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.MoneySinkDTO;
import mh.michael.monopolybanking.dto.NewMoneySinkRequestDTO;
import mh.michael.monopolybanking.exception.EntityNotFoundException;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class MoneySinkService {
    private final GameRepository gameRepository;

    public MoneySinkService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional
    public MoneySinkDTO createMoneySink(long gameId, NewMoneySinkRequestDTO newMoneySinkRequestDTO) {
        Game game = gameRepository.getOne(gameId);
        MoneySink newMoneySink = MoneySink.builder()
                .isBank(false)
                .sinkName(newMoneySinkRequestDTO.getSinkName())
                .moneyBalance(newMoneySinkRequestDTO.getMoneyBalance())
                .game(game)
                .build();
        game.addMoneySink(newMoneySink);
        Game updatedGame = gameRepository.save(game);
        MoneySink updatedMoneySink = updatedGame.getMoneySinks().stream()
                .filter(moneySink -> moneySink.getSinkName().equals(newMoneySink.getSinkName()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("money sink not found"));

        return ConvertDTOUtil.convertMoneySinkToMoneySinkDTO(updatedMoneySink);
    }

    @Transactional
    public MoneySinkDTO getMoneySinkById(long gameId, long sinkId) {
        Game game = gameRepository.getOne(gameId);
        MoneySink foundSink = game.getMoneySinks().stream().filter(sink -> sink.getId() == sinkId).findFirst().orElseThrow(() -> new EntityNotFoundException("money sink not found"));
        return ConvertDTOUtil.convertMoneySinkToMoneySinkDTO(foundSink);
    }

    @Transactional
    public List<MoneySinkDTO> getMoneySinksByGameId(long gameId) {
        Game game = gameRepository.getOne(gameId);
        return ConvertDTOUtil.convertMoneySinkListToMoneySinkDTOList(game.getMoneySinks());
    }
}
