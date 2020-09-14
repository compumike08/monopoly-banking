package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.exception.DataOutOfSyncException;
import mh.michael.monopolybanking.exception.EntityNotFoundException;
import mh.michael.monopolybanking.exception.InsufficentFundsException;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static mh.michael.monopolybanking.util.Constants.INITIAL_BANK_AMT;

@Service
@Slf4j
public class PayService {
    private final GameRepository gameRepository;
    private final UserService userService;
    private final MoneySinkService moneySinkService;

    public PayService(
            GameRepository gameRepository,
            UserService userService,
            MoneySinkService moneySinkService
    ) {
        this.gameRepository = gameRepository;
        this.userService = userService;
        this.moneySinkService = moneySinkService;

    }

    @Transactional
    public PayResponseDTO payMoney(long gameId, PayRequestDTO payRequestDTO) {
        log.info("Initiating payment...");
        Game game = gameRepository.getOne(gameId);
        MoneySink fromMoneySink = null;
        MoneySink toMoneySink = null;
        User fromUser = null;
        User toUser = null;

        if (payRequestDTO.isFromSink()) {
            fromMoneySink = game.getMoneySinks().stream()
                    .filter(moneySink -> moneySink.getId() == payRequestDTO.getFromId())
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("from money sink not found"));

            if (fromMoneySink.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for fromMoneySink";
                log.error(errMsg);
                throw new DataOutOfSyncException(errMsg);
            }

            int balanceRemaining = fromMoneySink.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                if (fromMoneySink.isBank()) {
                    // The bank cannot run out of money, so if bank hits 0 then reset bank balance back to initial starting amount
                    balanceRemaining = INITIAL_BANK_AMT;
                } else {
                    throw new InsufficentFundsException("Insufficient Funds");
                }
            }

            fromMoneySink.setMoneyBalance(balanceRemaining);
        } else {
            fromUser = game.getUsers().stream()
                    .filter(user -> user.getId() == payRequestDTO.getFromId())
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("from user not found"));

            if (fromUser.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for fromUser";
                log.error(errMsg);
                throw new DataOutOfSyncException(errMsg);
            }

            int balanceRemaining = fromUser.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                throw new InsufficentFundsException("Insufficient Funds");
            }

            fromUser.setMoneyBalance(balanceRemaining);
        }

        if (payRequestDTO.isToSink()) {
            toMoneySink = game.getMoneySinks().stream()
                    .filter(moneySink -> moneySink.getId() == payRequestDTO.getToId())
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("to money sink not found"));

            if (toMoneySink.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for toMoneySink";
                log.error(errMsg);
                throw new DataOutOfSyncException(errMsg);
            }

            toMoneySink.setMoneyBalance(toMoneySink.getMoneyBalance() + payRequestDTO.getAmountToPay());
        } else {
            toUser = game.getUsers().stream()
                    .filter(user -> user.getId() == payRequestDTO.getToId())
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("to user not found"));

            if (toUser.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for toUser";
                log.error(errMsg);
                throw new DataOutOfSyncException(errMsg);
            }

            toUser.setMoneyBalance(toUser.getMoneyBalance() + payRequestDTO.getAmountToPay());
        }

        if (payRequestDTO.isFromSink()) {
            game.updateMoneySink(fromMoneySink);
        } else {
            game.updateUser(fromUser);
        }

        if (payRequestDTO.isToSink()) {
            game.updateMoneySink(toMoneySink);
        } else {
            game.updateUser(toUser);
        }

        gameRepository.save(game);
        log.info("...payment complete");

        PayResponseDTO payResponseDTO = new PayResponseDTO();
        payResponseDTO.setPayRequestUUID(payRequestDTO.getPayRequestUUID());
        payResponseDTO.setRequestInitiatorUserId(payRequestDTO.getRequestInitiatorUserId());

        if (payRequestDTO.isFromSink()) {
            assert fromMoneySink != null;
            payResponseDTO.setFromMoneySink(moneySinkService.getMoneySinkById(gameId, fromMoneySink.getId()));
            payResponseDTO.setFromSink(true);
        } else {
            assert fromUser != null;
            payResponseDTO.setFromUser(userService.getUserById(gameId, fromUser.getId()));
            payResponseDTO.setFromSink(false);
        }

        if (payRequestDTO.isToSink()) {
            assert toMoneySink != null;
            payResponseDTO.setToMoneySink(moneySinkService.getMoneySinkById(gameId, toMoneySink.getId()));
            payResponseDTO.setToSink(true);
        } else {
            assert toUser != null;
            payResponseDTO.setToUser(userService.getUserById(gameId, toUser.getId()));
            payResponseDTO.setToSink(false);
        }

        return payResponseDTO;
    }
}
