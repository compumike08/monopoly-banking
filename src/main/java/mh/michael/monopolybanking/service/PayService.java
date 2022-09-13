package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.OptionalUtil;
import mh.michael.monopolybanking.constants.UserRole;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static mh.michael.monopolybanking.constants.Constants.INITIAL_BANK_AMT;
import static mh.michael.monopolybanking.constants.Constants.OUT_OF_SYNC_ERR_MSG;

@Service
@Slf4j
public class PayService {
    private final MoneySinkRepository moneySinkRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final MoneySinkService moneySinkService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public PayService(
            MoneySinkRepository moneySinkRepository,
            UserRepository userRepository,
            UserService userService,
            MoneySinkService moneySinkService,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.moneySinkRepository = moneySinkRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.moneySinkService = moneySinkService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public PayResponseDTO payMoney(PayRequestDTO payRequestDTO, JwtUserDetails jwtUserDetails) {
        log.info("Initiating payment...");
        Long authRequesterUserId = jwtUserDetails.getId();
        Long authGameId = jwtUserDetails.getGameId();

        long gameId = payRequestDTO.getGameId();

        if (!authGameId.equals(gameId)) {
            log.error("User attempted to forge the game id in their pay request");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        MoneySink fromMoneySink = null;
        MoneySink toMoneySink = null;
        User fromUser = null;
        User toUser = null;

        if (payRequestDTO.getIsFromSink()) {
            Optional<User> requesterUserOpt = userRepository.findById(payRequestDTO.getRequestInitiatorUserId());
            User requesterUser = OptionalUtil
                    .getTypeFromOptionalOrThrowNotFound(
                            requesterUserOpt,
                            "Requester user not found",
                            payRequestDTO.getRequestInitiatorUserId()
                    );

            if (!requesterUser.getUserRole().equals(UserRole.BANKER.name())) {
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
            if (!authRequesterUserId.equals(payRequestDTO.getFromId())) {
                log.error("User attempted to pay from a source they don't have access to");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
            }

            Optional<User> fromUserOpt = userRepository.findById(payRequestDTO.getFromId());

            fromUser = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                    fromUserOpt,
                    "From user not found",
                    payRequestDTO.getFromId()
            );

            if (fromUser.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                log.error("Payment request original amount doesn't match current amount for fromUser");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            long balanceRemaining = fromUser.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Insufficient Funds");
            }

            fromUser.setMoneyBalance(balanceRemaining);
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
            Optional<User> toUserOpt = userRepository.findById(payRequestDTO.getToId());
            toUser = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                    toUserOpt,
                    "To user not found",
                    payRequestDTO.getToId()
            );

            if (toUser.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                log.error("Payment request original amount doesn't match current amount for toUser");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }

            toUser.setMoneyBalance(toUser.getMoneyBalance() + payRequestDTO.getAmountToPay());
        }

        if (payRequestDTO.getIsFromSink()) {
            assert fromMoneySink != null;
            if (fromMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromMoneySink entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            moneySinkRepository.save(fromMoneySink);
        } else {
            assert fromUser != null;
            if (fromUser.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromUser entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            userRepository.save(fromUser);
        }

        if (payRequestDTO.getIsToSink()) {
            assert toMoneySink != null;
            if (toMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toMoneySink entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            moneySinkRepository.save(toMoneySink);
        } else {
            assert toUser != null;
            if (toUser.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toUser entity");
                throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED, OUT_OF_SYNC_ERR_MSG);
            }
            userRepository.save(toUser);
        }

        log.debug("Entities involved in payment transaction have been updated and saved");

        PayResponseDTO payResponseDTO = new PayResponseDTO();
        payResponseDTO.setGameId(gameId);
        payResponseDTO.setPayRequestUUID(payRequestDTO.getPayRequestUUID());
        payResponseDTO.setRequestInitiatorUserId(payRequestDTO.getRequestInitiatorUserId());
        payResponseDTO.setAmountPaid(payRequestDTO.getAmountToPay());

        if (payRequestDTO.getIsFromSink()) {
            assert fromMoneySink != null;
            payResponseDTO.setFromMoneySink(moneySinkService.getMoneySinkById(fromMoneySink.getId()));
            payResponseDTO.setIsFromSink(true);
        } else {
            assert fromUser != null;
            payResponseDTO.setFromUser(userService.getUserById(fromUser.getId()));
            payResponseDTO.setIsFromSink(false);
        }

        if (payRequestDTO.getIsToSink()) {
            assert toMoneySink != null;
            payResponseDTO.setToMoneySink(moneySinkService.getMoneySinkById(toMoneySink.getId()));
            payResponseDTO.setIsToSink(true);
        } else {
            assert toUser != null;
            payResponseDTO.setToUser(userService.getUserById(toUser.getId()));
            payResponseDTO.setIsToSink(false);
        }

        simpMessagingTemplate.convertAndSend("/topic/game/" + gameId + "/payment", payResponseDTO);
        log.debug("Websocket message sent");
        log.info("...payment complete");

        return payResponseDTO;
    }
}
