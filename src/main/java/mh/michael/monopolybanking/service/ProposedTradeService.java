package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.NewProposedTradeRequestDTO;
import mh.michael.monopolybanking.dto.ProposedTradeDTO;
import mh.michael.monopolybanking.model.Game;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.model.PropertyClaim;
import mh.michael.monopolybanking.model.ProposedTrade;
import mh.michael.monopolybanking.repository.PlayerRepository;
import mh.michael.monopolybanking.repository.PropertyClaimRepository;
import mh.michael.monopolybanking.repository.ProposedTradeRepository;
import mh.michael.monopolybanking.security.JwtUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import static mh.michael.monopolybanking.constants.Constants.INTERNAL_SERVER_ERROR_MSG;
import static mh.michael.monopolybanking.util.ConvertDTOUtil.convertProposedTradeListToProposedTradeDTOList;
import static mh.michael.monopolybanking.util.ConvertDTOUtil.convertProposedTradeToProposedTradeDTO;

@Service
@Slf4j
public class ProposedTradeService {
    private final ProposedTradeRepository proposedTradeRepository;
    private final PlayerRepository playerRepository;
    private final PropertyClaimRepository propertyClaimRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public ProposedTradeService(
            ProposedTradeRepository proposedTradeRepository,
            PlayerRepository playerRepository,
            PropertyClaimRepository propertyClaimRepository,
            SimpMessagingTemplate simpMessagingTemplate
    ) {
        this.proposedTradeRepository = proposedTradeRepository;
        this.playerRepository = playerRepository;
        this.propertyClaimRepository = propertyClaimRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Transactional
    public List<ProposedTradeDTO> getAllProposedTradesByProposingPlayerId(
            long playerId,
            JwtUserDetails jwtUserDetails
    ) {
        if (!jwtUserDetails.getPlayerIdList().contains(playerId)) {
            log.error("User attempted to get proposed trades as player they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<ProposedTrade> proposedTradeList = proposedTradeRepository.findByProposingPlayerId(playerId);
        return convertProposedTradeListToProposedTradeDTOList(proposedTradeList);
    }

    @Transactional
    public List<ProposedTradeDTO> getAllProposedTradesByRequestedPlayerId(
            long playerId,
            JwtUserDetails jwtUserDetails
    ) {
        if (!jwtUserDetails.getPlayerIdList().contains(playerId)) {
            log.error("User attempted to get proposed trades as player they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<ProposedTrade> proposedTradeList = proposedTradeRepository.findByRequestedPlayerId(playerId);
        return convertProposedTradeListToProposedTradeDTOList(proposedTradeList);
    }

    @Transactional
    public ProposedTradeDTO proposeTrade(
            NewProposedTradeRequestDTO requestDTO,
            JwtUserDetails jwtUserDetails
    ) {
        if (!jwtUserDetails.getGameIdList().contains(requestDTO.getGameId())) {
            log.error("User attempted to propose trade in game they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        if (!jwtUserDetails.getPlayerIdList().contains(requestDTO.getProposingPlayerId())) {
            log.error("User attempted to propose trade as player they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        if (requestDTO.getAmountMoneyRequested() < 0 || requestDTO.getAmountMoneyOffered() < 0) {
            log.error("User attempted to propose trade involving negative money amounts");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid money amount(s)");
        }

        List<ProposedTrade> allProposedTradesInGameList = proposedTradeRepository.findByGame_Id(requestDTO.getGameId());

        List<PropertyClaim> allPropertyClaimsInProposedTrades = new ArrayList<>();

        allProposedTradesInGameList.forEach(proposedTrade -> {
            allPropertyClaimsInProposedTrades.addAll(proposedTrade.getOfferedPropertyClaims());
            allPropertyClaimsInProposedTrades.addAll(proposedTrade.getRequestedPropertyClaims());
        });

        List<Long> allProposedTradesPropertyClaimListIds = allPropertyClaimsInProposedTrades.stream()
                .map(PropertyClaim::getId).collect(Collectors.toList());

        AtomicBoolean isAlreadyInProposedTrade = new AtomicBoolean(false);

        requestDTO.getProposedPropertyClaimIds().forEach(propertyClaimId -> {
            if (allProposedTradesPropertyClaimListIds.contains(propertyClaimId)) {
                isAlreadyInProposedTrade.set(true);
            }
        });

        if (isAlreadyInProposedTrade.get()) {
            log.info("The user attempted to propose a trade involving one or more property claims that are already in other proposed trades");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more properties in trade are already part of other proposed trades");
        }

        AtomicBoolean isPropertyClaimInBothProposedAndRequested = new AtomicBoolean(false);

        requestDTO.getProposedPropertyClaimIds().forEach(proposedPropertyClaimId -> {
            if (requestDTO.getRequestedPropertyClaimIds().contains(proposedPropertyClaimId)) {
                isPropertyClaimInBothProposedAndRequested.set(true);
            }
        });

        if (isPropertyClaimInBothProposedAndRequested.get()) {
            log.error("The user attempted to propose a trade involving property claims in both the proposed and requested lists");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Optional<Player> proposingPlayerOpt = playerRepository.findById(requestDTO.getProposingPlayerId());
        Optional<Player> requestedPlayerOpt = playerRepository.findById(requestDTO.getRequestedPlayerId());

        if (proposingPlayerOpt.isEmpty() || requestedPlayerOpt.isEmpty()) {
            log.error("Unable to find either proposing player or requested player by player id");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        Game game = proposingPlayerOpt.get().getGame();

        List<PropertyClaim> requestedPropertyClaims = propertyClaimRepository
                .findByIdIn(requestDTO.getRequestedPropertyClaimIds());

        List<PropertyClaim> proposedPropertyClaims = propertyClaimRepository
                .findByIdIn(requestDTO.getProposedPropertyClaimIds());

        AtomicBoolean isProposedPropertyClaimBelongingToOtherPlayer = new AtomicBoolean(false);

        requestDTO.getProposedPropertyClaimIds().forEach(proposedPropertyClaimId -> {
            if (!proposingPlayerOpt.get().getOwnedPropertyClaims()
                    .contains(propertyClaimRepository.getOne(proposedPropertyClaimId))) {
                isProposedPropertyClaimBelongingToOtherPlayer.set(true);
            }
        });

        if (isProposedPropertyClaimBelongingToOtherPlayer.get()) {
            log.error("Player proposed trading a property he/she doesn't own");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        AtomicBoolean isRequestedPropertyClaimBelongingToOtherPlayer = new AtomicBoolean(false);

        requestDTO.getRequestedPropertyClaimIds().forEach(requestedPropertyClaimId -> {
            if (!requestedPlayerOpt.get().getOwnedPropertyClaims()
                    .contains(propertyClaimRepository.getOne(requestedPropertyClaimId))) {
                isRequestedPropertyClaimBelongingToOtherPlayer.set(true);
            }
        });

        if (isRequestedPropertyClaimBelongingToOtherPlayer.get()) {
            log.error("Player requested trading for a property the other player doesn't own");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        if (requestDTO.getAmountMoneyOffered() > proposingPlayerOpt.get().getMoneyBalance()) {
            log.info("Player proposed a trade offering more money that he/she has");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You cannot propose a trade that offers more money than you have");
        }

        if (requestDTO.getAmountMoneyRequested() > requestedPlayerOpt.get().getMoneyBalance()) {
            log.info("Player proposed a trade requesting more money than the other play has");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You cannot propose a trade that requests more money than the other player has");
        }

        ProposedTrade newProposedTrade = ProposedTrade.builder()
                .proposingPlayer(proposingPlayerOpt.get())
                .requestedPlayer(requestedPlayerOpt.get())
                .game(game)
                .amountMoneyOffered(requestDTO.getAmountMoneyOffered())
                .amountMoneyRequested(requestDTO.getAmountMoneyRequested())
                .requestedPropertyClaims(requestedPropertyClaims)
                .offeredPropertyClaims(proposedPropertyClaims)
                .build();

        ProposedTrade savedProposedTrade = proposedTradeRepository.save(newProposedTrade);

        requestedPropertyClaims.forEach(propertyClaim -> {
            propertyClaim.setRequestedInProposedTrade(savedProposedTrade);
            propertyClaimRepository.save(propertyClaim);
        });

        proposedPropertyClaims.forEach(propertyClaim -> {
            propertyClaim.setOfferedInProposedTrade(savedProposedTrade);
            propertyClaimRepository.save(propertyClaim);
        });

        ProposedTrade newSavedProposedTrade = proposedTradeRepository.getOne(savedProposedTrade.getId());

        ProposedTradeDTO savedProposedTradeDTO = convertProposedTradeToProposedTradeDTO(newSavedProposedTrade);

        savedProposedTradeDTO.setIsProposedTradeCreated(true);

        simpMessagingTemplate.convertAndSend(
                "/topic/player/" + requestDTO.getRequestedPlayerId() + "/proposedTrade", savedProposedTradeDTO);
        log.debug("Proposed trade websocket message sent");

        return savedProposedTradeDTO;
    }

    @Transactional
    public ProposedTradeDTO cancelProposedTrade(long proposedTradeId, JwtUserDetails jwtUserDetails) {
        Optional<ProposedTrade> optProposedTrade = proposedTradeRepository.findById(proposedTradeId);
        if (optProposedTrade.isEmpty()) {
            log.error("Proposed trade id {} not found", proposedTradeId);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        ProposedTrade proposedTrade = optProposedTrade.get();

        if (!jwtUserDetails.getPlayerIdList().contains(proposedTrade.getProposingPlayer().getId())) {
            log.error("User attempted to cancel a proposed trade that they don't have access to");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        List<Long> offeredPropertyClaimsIdsList = proposedTrade.getOfferedPropertyClaims().stream()
                .map(PropertyClaim::getId).collect(Collectors.toList());
        List<Long> requestedPropertyClaimsIdsList = proposedTrade.getRequestedPropertyClaims().stream()
                .map(PropertyClaim::getId).collect(Collectors.toList());

        List<Long> allPropertyClaimsIdsList = new ArrayList<>();
        allPropertyClaimsIdsList.addAll(offeredPropertyClaimsIdsList);
        allPropertyClaimsIdsList.addAll(requestedPropertyClaimsIdsList);

        List<PropertyClaim> propertyClaimList = propertyClaimRepository.findByIdIn(allPropertyClaimsIdsList);

        propertyClaimList.forEach(propertyClaim -> {
            propertyClaim.setOfferedInProposedTrade(null);
            propertyClaim.setRequestedInProposedTrade(null);
            propertyClaimRepository.save(propertyClaim);
        });

        proposedTrade = proposedTradeRepository.getOne(proposedTradeId);

        proposedTradeRepository.delete(proposedTrade);

        ProposedTradeDTO deletedProposedTradeDTO = convertProposedTradeToProposedTradeDTO(proposedTrade);

        deletedProposedTradeDTO.setIsProposedTradeCancelled(true);

        simpMessagingTemplate.convertAndSend(
                "/topic/player/" + proposedTrade.getRequestedPlayer().getId() + "/proposedTrade", deletedProposedTradeDTO);
        log.debug("Cancel proposed trade websocket message sent");

        return deletedProposedTradeDTO;
    }
}
