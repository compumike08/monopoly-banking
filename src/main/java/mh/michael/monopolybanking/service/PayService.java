package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.util.UserRole;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static mh.michael.monopolybanking.util.Constants.INITIAL_BANK_AMT;

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
    public PayResponseDTO payMoney(PayRequestDTO payRequestDTO) {
        log.info("Initiating payment...");
        long gameId = payRequestDTO.getGameId();

        MoneySink fromMoneySink = null;
        MoneySink toMoneySink = null;
        User fromUser = null;
        User toUser = null;

        if (payRequestDTO.getIsFromSink()) {
            User requesterUser = userRepository.getOne(payRequestDTO.getRequestInitiatorUserId());

            if (!requesterUser.getUserRole().equals(UserRole.BANKER.name())) {
                String errMsg = "Only the banker can pay from a money sink";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, errMsg);
            }

            fromMoneySink = moneySinkRepository.getOne(payRequestDTO.getFromId());

            if (fromMoneySink.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for fromMoneySink";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
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
            fromUser = userRepository.getOne(payRequestDTO.getFromId());

            if (fromUser.getMoneyBalance() != payRequestDTO.getOriginalFromAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for fromUser";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
            }

            long balanceRemaining = fromUser.getMoneyBalance() - payRequestDTO.getAmountToPay();

            if (balanceRemaining < 0) {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Insufficient Funds");
            }

            fromUser.setMoneyBalance(balanceRemaining);
        }

        if (payRequestDTO.getIsToSink()) {
            toMoneySink = moneySinkRepository.getOne(payRequestDTO.getToId());

            if (toMoneySink.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for toMoneySink";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
            }

            toMoneySink.setMoneyBalance(toMoneySink.getMoneyBalance() + payRequestDTO.getAmountToPay());
        } else {
            toUser = userRepository.getOne(payRequestDTO.getToId());

            if (toUser.getMoneyBalance() != payRequestDTO.getOriginalToAmount()) {
                String errMsg = "Payment request original amount doesn't match current amount for toUser";
                log.error(errMsg);
                throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
            }

            toUser.setMoneyBalance(toUser.getMoneyBalance() + payRequestDTO.getAmountToPay());
        }

        if (payRequestDTO.getIsFromSink()) {
            assert fromMoneySink != null;
            if (fromMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromMoneySink entity");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "from and/or to entities not found for specified gameId");
            }
            moneySinkRepository.save(fromMoneySink);
        } else {
            assert fromUser != null;
            if (fromUser.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the fromUser entity");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "from and/or to entities not found for specified gameId");
            }
            userRepository.save(fromUser);
        }

        if (payRequestDTO.getIsToSink()) {
            assert toMoneySink != null;
            if (toMoneySink.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toMoneySink entity");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "from and/or to entities not found for specified gameId");
            }
            moneySinkRepository.save(toMoneySink);
        } else {
            assert toUser != null;
            if (toUser.getGame().getId() != gameId) {
                log.error("The gameId in the payRequest does not match the gameId on the toUser entity");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "from and/or to entities not found for specified gameId");
            }
            userRepository.save(toUser);
        }

        log.info("...payment complete");

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

        return payResponseDTO;
    }
}
