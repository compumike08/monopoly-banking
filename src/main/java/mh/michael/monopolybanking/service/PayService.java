package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.Payment;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.repository.GameRepository;
import mh.michael.monopolybanking.repository.PaymentRepository;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import mh.michael.monopolybanking.util.OptionalUtil;
import mh.michael.monopolybanking.constants.PlayerRole;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static mh.michael.monopolybanking.constants.Constants.INITIAL_BANK_AMT;
import static mh.michael.monopolybanking.constants.Constants.OUT_OF_SYNC_ERR_MSG;

@Service
@Slf4j
public class PayService {
    private final MoneySinkRepository moneySinkRepository;
    private final PlayerRepository playerRepository;
    private final PaymentRepository paymentRepository;
    private final GameRepository gameRepository;
    private final PlayerService playerService;
    private final MoneySinkService moneySinkService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public PayService(
            MoneySinkRepository moneySinkRepository,
            PlayerRepository playerRepository,
            PaymentRepository paymentRepository,
            GameRepository gameRepository,
            PlayerService playerService,
            MoneySinkService moneySinkService,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.moneySinkRepository = moneySinkRepository;
        this.playerRepository = playerRepository;
        this.paymentRepository = paymentRepository;
        this.gameRepository = gameRepository;
        this.playerService = playerService;
        this.moneySinkService = moneySinkService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public List<PayResponseDTO> getPaymentList(long gameId, JwtUserDetails jwtUserDetails) {
        if (jwtUserDetails.getGameIdList().parallelStream().noneMatch(thisGameId -> thisGameId.equals(gameId))) {
            log.error("User attempted to access list of payments for game that user does not belong to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        List<Payment> paymentList = paymentRepository.findAllByGame_Id(gameId);
        return ConvertDTOUtil.convertPaymentListToPayResponseDTOList(paymentList);
    }

    @Transactional
    public PayResponseDTO payMoney(
            PayRequestDTO payRequestDTO,
            JwtUserDetails jwtUserDetails,
            boolean isSystemBankPayment
    ) {
        log.info("Initiating payment...");
        List<Long> authGameIdList = jwtUserDetails.getGameIdList();
        List<Long> authPlayerIdList = jwtUserDetails.getPlayerIdList();

        long gameId = payRequestDTO.getGameId();

        if (!authGameIdList.contains(gameId)) {
            log.error("User attempted to forge the game id in their pay request");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        MoneySink fromMoneySink = null;
        MoneySink toMoneySink = null;
        Player fromPlayer = null;
        Player toPlayer = null;

        Optional<Player> requesterUserOpt = playerRepository.findById(payRequestDTO.getRequestInitiatorPlayerId());
        Player requesterPlayer = OptionalUtil
                .getTypeFromOptionalOrThrowNotFound(
                        requesterUserOpt,
                        "Requester player not found",
                        payRequestDTO.getRequestInitiatorPlayerId()
                );

        if (!authPlayerIdList.contains(payRequestDTO.getRequestInitiatorPlayerId())) {
            log.error("User attempted to forge the requestInitiatorPlayerId in their pay request");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        if (payRequestDTO.getIsFromSink()) {
            if (!requesterPlayer.getPlayerRole().equals(PlayerRole.BANKER.name()) && !isSystemBankPayment) {
                String errMsg = "Only the banker can pay from a money sink";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, errMsg);
            }

            Optional<MoneySink> fromMoneySinkOpt = moneySinkRepository.findById(payRequestDTO.getFromId());
            fromMoneySink = OptionalUtil
                    .getTypeFromOptionalOrThrowNotFound(
                            fromMoneySinkOpt,
                            "From money sink not found",
                            payRequestDTO.getFromId()
                    );

            if (fromMoneySink.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                log.error("Payment request original amount doesn't match current amount for fromMoneySink");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            long balanceRemaining = fromMoneySink.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                if (fromMoneySink.getIsBank()) {
                    // The bank cannot run out of money, so if bank hits 0 then reset bank balance back to initial starting amount
                    balanceRemaining = INITIAL_BANK_AMT;
                } else {
                    throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Insufficient Funds");
                }
            }

            fromMoneySink.setMoneyBalance(balanceRemaining);
        } else {
            if (payRequestDTO.getRequestInitiatorPlayerId() != payRequestDTO.getFromId()) {
                log.error("User attempted to pay from a source they don't have access to");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
            }

            Optional<Player> fromUserOpt = playerRepository.findById(payRequestDTO.getFromId());

            fromPlayer = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                    fromUserOpt,
                    "From user not found",
                    payRequestDTO.getFromId()
            );

            if (fromPlayer.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                log.error("Payment request original amount doesn't match current amount for fromUser");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            long balanceRemaining = fromPlayer.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Insufficient Funds");
            }

            fromPlayer.setMoneyBalance(balanceRemaining);
        }

        if (payRequestDTO.getIsToSink()) {
            Optional<MoneySink> toMoneySinkOpt = moneySinkRepository.findById(payRequestDTO.getToId());
            toMoneySink = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                    toMoneySinkOpt,
                    "To money sink not found",
                    payRequestDTO.getToId()
            );

            if (toMoneySink.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                log.error("Payment request original amount doesn't match current amount for toMoneySink");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            toMoneySink.setMoneyBalance(toMoneySink.getMoneyBalance() + payRequestDTO.getAmountToPay());
        } else {
            Optional<Player> toUserOpt = playerRepository.findById(payRequestDTO.getToId());
            toPlayer = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                    toUserOpt,
                    "To user not found",
                    payRequestDTO.getToId()
            );

            if (toPlayer.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                log.error("Payment request original amount doesn't match current amount for toUser");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            toPlayer.setMoneyBalance(toPlayer.getMoneyBalance() + payRequestDTO.getAmountToPay());
        }

        if (payRequestDTO.getIsFromSink()) {
            assert fromMoneySink != null;
            if (fromMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromMoneySink entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            moneySinkRepository.save(fromMoneySink);
        } else {
            assert fromPlayer != null;
            if (fromPlayer.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromUser entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            playerRepository.save(fromPlayer);
        }

        if (payRequestDTO.getIsToSink()) {
            assert toMoneySink != null;
            if (toMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toMoneySink entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            moneySinkRepository.save(toMoneySink);
        } else {
            assert toPlayer != null;
            if (toPlayer.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toUser entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            playerRepository.save(toPlayer);
        }

        log.debug("Entities involved in payment transaction have been updated and saved");

        PayResponseDTO payResponseDTO = new PayResponseDTO();
        payResponseDTO.setGameId(gameId);
        payResponseDTO.setPayRequestUUID(payRequestDTO.getPayRequestUUID());
        payResponseDTO.setRequestInitiatorPlayerId(payRequestDTO.getRequestInitiatorPlayerId());
        payResponseDTO.setAmountPaid(payRequestDTO.getAmountToPay());

        if (payRequestDTO.getIsFromSink()) {
            assert fromMoneySink != null;
            payResponseDTO.setFromMoneySink(moneySinkService.getMoneySinkById(fromMoneySink.getId()));
            payResponseDTO.setIsFromSink(true);
        } else {
            assert fromPlayer != null;
            payResponseDTO.setFromPlayer(playerService.getPlayerById(fromPlayer.getId()));
            payResponseDTO.setIsFromSink(false);
        }

        if (payRequestDTO.getIsToSink()) {
            assert toMoneySink != null;
            payResponseDTO.setToMoneySink(moneySinkService.getMoneySinkById(toMoneySink.getId()));
            payResponseDTO.setIsToSink(true);
        } else {
            assert toPlayer != null;
            payResponseDTO.setToPlayer(playerService.getPlayerById(toPlayer.getId()));
            payResponseDTO.setIsToSink(false);
        }

        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Game game = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                gameOpt,
                "Game not found",
                gameId
        );

        Payment payment = Payment.builder()
                .amountPaid(payResponseDTO.getAmountPaid())
                .fromMoneySink(fromMoneySink)
                .toMoneySink(toMoneySink)
                .fromPlayer(fromPlayer)
                .toPlayer(toPlayer)
                .requesterPlayer(requesterPlayer)
                .game(game)
                .isFromSink(payResponseDTO.getIsFromSink())
                .isToSink(payResponseDTO.getIsToSink())
                .payRequestUuid(payResponseDTO.getPayRequestUUID())
                .build();

        paymentRepository.save(payment);

        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/payment", payResponseDTO);
        log.debug("Payment websocket message sent");
        log.info("...payment complete");

        return payResponseDTO;
    }
}
