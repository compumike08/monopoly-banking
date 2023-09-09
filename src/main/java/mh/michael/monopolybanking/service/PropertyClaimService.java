package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PropertyClaimDTO;
import mh.michael.monopolybanking.dto.PurchasePropertyClaimRequestDTO;
import mh.michael.monopolybanking.model.MoneySink;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.model.PropertyClaim;
import mh.michael.monopolybanking.repository.MoneySinkRepository;
import mh.michael.monopolybanking.repository.PlayerRepository;
import mh.michael.monopolybanking.repository.PropertyClaimRepository;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static mh.michael.monopolybanking.constants.Constants.INTERNAL_SERVER_ERROR_MSG;

@Service
@Slf4j
public class PropertyClaimService {
    private final PropertyClaimRepository propertyClaimRepository;
    private final PlayerRepository playerRepository;
    private final MoneySinkRepository moneySinkRepository;
    private final PayService payService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public PropertyClaimService(
            PropertyClaimRepository propertyClaimRepository,
            PlayerRepository playerRepository,
            MoneySinkRepository moneySinkRepository,
            PayService payService,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.propertyClaimRepository = propertyClaimRepository;
        this.playerRepository = playerRepository;
        this.moneySinkRepository = moneySinkRepository;
        this.payService = payService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public List<PropertyClaimDTO> getAllPropertyClaimsInGame(long gameId, JwtUserDetails jwtUserDetails) {
        if (!jwtUserDetails.getGameIdList().contains(gameId)) {
            log.error("User attempted to get list of all property claims for game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<PropertyClaim> propertyClaimList = propertyClaimRepository.findByGame_Id(gameId);
        return ConvertDTOUtil.convertPropertyClaimListToPropertyClaimDTOList(propertyClaimList);
    }

    @Transactional
    public List<PropertyClaimDTO> getAllPropertyClaimsOwnedByPlayer(
            long gameId,
            long playerId,
            JwtUserDetails jwtUserDetails
    ) {
        if (!jwtUserDetails.getGameIdList().contains(gameId)) {
            log.error("User attempted to get list of property claims owned by player in a game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<PropertyClaim> propertyClaimList = propertyClaimRepository.findByOwnedByPlayer_Id(playerId);
        return ConvertDTOUtil.convertPropertyClaimListToPropertyClaimDTOList(propertyClaimList);
    }

    @Transactional
    public List<PropertyClaimDTO> getAllUnclaimedPropertyClaimsInGame(long gameId, JwtUserDetails jwtUserDetails) {
        if (!jwtUserDetails.getGameIdList().contains(gameId)) {
            log.error("User attempted to get list of unclaimed property claims for game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<PropertyClaim> propertyClaimList = propertyClaimRepository.findByGame_IdAndOwnedByPlayerIsNull(gameId);
        return ConvertDTOUtil.convertPropertyClaimListToPropertyClaimDTOList(propertyClaimList);
    }

    @Transactional
    public PropertyClaimDTO purchasePropertyClaimFromBank(
            PurchasePropertyClaimRequestDTO requestDTO,
            JwtUserDetails jwtUserDetails
    ) {
        if (requestDTO.getPropertyClaimId() == null ||
                requestDTO.getPlayerId() == null ||
                requestDTO.getGameId() == null
        ) {
            log.error("Invalid PurchasePropertyClaimRequestDTO");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request");
        }

        if (!jwtUserDetails.getGameIdList().contains(requestDTO.getGameId())) {
            log.error("User attempted to purchase property claim in game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        if (!jwtUserDetails.getPlayerIdList().contains(requestDTO.getPlayerId())) {
            log.error("User attempted to purchase property claim as player they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Optional<PropertyClaim> optPropertyClaim = propertyClaimRepository.findById(requestDTO.getPropertyClaimId());

        if (optPropertyClaim.isEmpty()) {
            log.error("Unable to find property claim with requested id of: " + requestDTO.getPropertyClaimId());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        PropertyClaim propertyClaim = optPropertyClaim.get();

        if (propertyClaim.getOwnedByPlayer() != null) {
            log.error("Player tried to purchase a property claim owned by another player");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Someone else already owns this property");
        }

        Optional<Player> optPlayer = playerRepository.findById(requestDTO.getPlayerId());

        if (optPlayer.isEmpty()) {
            log.error("Unable to find player with id of: " + requestDTO.getPlayerId());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Player player = optPlayer.get();

        MoneySink bankMoneySink = moneySinkRepository.findByGame_IdAndIsBankIsTrue(requestDTO.getGameId());

        // Create payment request to pay for purchasing property
        PayRequestDTO payRequestDTO = PayRequestDTO.builder()
                .payRequestUUID(UUID.randomUUID().toString())
                .amountToPay(propertyClaim.getProperty().getCost())
                .isToSink(true)
                .isFromSink(false)
                .fromId(player.getId())
                .toId(bankMoneySink.getId())
                .gameId(requestDTO.getGameId())
                .originalFromAmount(player.getMoneyBalance())
                .originalToAmount(bankMoneySink.getMoneyBalance())
                .requestInitiatorPlayerId(player.getId())
                .build();

        payService.payMoney(payRequestDTO, jwtUserDetails, false);

        propertyClaim.setOwnedByPlayer(player);

        PropertyClaim savedPropertyClaim = propertyClaimRepository.save(propertyClaim);

        PropertyClaimDTO propertyClaimDTO = ConvertDTOUtil.convertPropertyClaimToPropertyClaimDTO(savedPropertyClaim);

        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + requestDTO.getGameId() + "/propertyUpdate", propertyClaimDTO);
        log.debug("Property update websocket message sent");

        return propertyClaimDTO;
    }

    @Transactional
    public PropertyClaimDTO mortgageProperty(
            long gameId,
            long playerId,
            long propertyClaimId,
            JwtUserDetails jwtUserDetails
    ) {
        if (!jwtUserDetails.getGameIdList().contains(gameId)) {
            log.error("User attempted to mortgage property claim in game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        if (!jwtUserDetails.getPlayerIdList().contains(playerId)) {
            log.error("User attempted to mortgage property claim as player they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Optional<PropertyClaim> optPropertyClaim = propertyClaimRepository.findById(propertyClaimId);

        if (optPropertyClaim.isEmpty()) {
            log.error("Unable to find property claim with requested id of: " + propertyClaimId);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        PropertyClaim propertyClaim = optPropertyClaim.get();

        if (propertyClaim.getOwnedByPlayer().getId() != playerId) {
            log.error("Player tried to mortgage a property claim owned by another player");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Optional<Player> optPlayer = playerRepository.findById(playerId);

        if (optPlayer.isEmpty()) {
            log.error("Unable to find player with id of: " + playerId);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        propertyClaim.setIsMortgaged(true);

        log.debug("Saving updated PropertyClaim...");
        PropertyClaim savedPropertyClaim = propertyClaimRepository.save(propertyClaim);

        Player player = optPlayer.get();

        MoneySink bankMoneySink = moneySinkRepository.findByGame_IdAndIsBankIsTrue(gameId);

        // Create payment request to pay player for mortgaging property
        PayRequestDTO payRequestDTO = PayRequestDTO.builder()
                .payRequestUUID(UUID.randomUUID().toString())
                .amountToPay(propertyClaim.getProperty().getMortgageValue())
                .isToSink(false)
                .isFromSink(true)
                .fromId(bankMoneySink.getId())
                .toId(player.getId())
                .gameId(gameId)
                .originalFromAmount(bankMoneySink.getMoneyBalance())
                .originalToAmount(player.getMoneyBalance())
                .requestInitiatorPlayerId(player.getId())
                .build();

        log.debug("Paying player for mortgaging property...");
        payService.payMoney(payRequestDTO, jwtUserDetails, true);

        PropertyClaimDTO propertyClaimDTO = ConvertDTOUtil.convertPropertyClaimToPropertyClaimDTO(savedPropertyClaim);

        propertyClaimDTO.setIsMortgagingPropertyMsg(true);

        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameId + "/propertyUpdate", propertyClaimDTO);
        log.debug("Property update websocket message sent");

        return propertyClaimDTO;
    }
}
