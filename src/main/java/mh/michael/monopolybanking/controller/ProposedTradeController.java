package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.NewProposedTradeRequestDTO;
import mh.michael.monopolybanking.dto.ProposedTradeDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.ProposedTradeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proposedTrades")
public class ProposedTradeController {
    private final ProposedTradeService proposedTradeService;

    public ProposedTradeController(ProposedTradeService proposedTradeService) {
        this.proposedTradeService = proposedTradeService;
    }

    @GetMapping("/player/{playerId}/listAllProposedTradesByProposingPlayerId")
    public List<ProposedTradeDTO> getAllProposedTradesByProposingPlayerId(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("playerId") long playerId
    ) {
        return proposedTradeService.getAllProposedTradesByProposingPlayerId(playerId, jwtUserDetails);
    }

    @GetMapping("/player/{playerId}/listAllProposedTradesByRequestedPlayerId")
    public List<ProposedTradeDTO> getAllProposedTradesByRequestedPlayerId(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("playerId") long playerId
    ) {
        return proposedTradeService.getAllProposedTradesByRequestedPlayerId(playerId, jwtUserDetails);
    }

    @PostMapping("/proposeTrade")
    public ProposedTradeDTO proposeTrade(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody NewProposedTradeRequestDTO requestDTO
    ) {
        return proposedTradeService.proposeTrade(requestDTO, jwtUserDetails);
    }
}
