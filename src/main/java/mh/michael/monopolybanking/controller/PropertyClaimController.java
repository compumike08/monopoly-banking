package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.PropertyClaimDTO;
import mh.michael.monopolybanking.dto.PurchasePropertyClaimRequestDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.PropertyClaimService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/propertyClaims")
public class PropertyClaimController {
    private final PropertyClaimService propertyClaimService;

    public PropertyClaimController(PropertyClaimService propertyClaimService) {
        this.propertyClaimService = propertyClaimService;
    }

    @GetMapping("/game/{gameId}/listAllPropertyClaims")
    public List<PropertyClaimDTO> getAllPropertyClaimsInGame(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId
    ) {
        return propertyClaimService.getAllPropertyClaimsInGame(gameId, jwtUserDetails);
    }

    @GetMapping("/game/{gameId}/playerId/{playerId}/ownedByPlayerList")
    public List<PropertyClaimDTO> getAllPropertyClaimsOwnedByPlayer(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId,
            @PathVariable("playerId") long playerId
    ) {
        return propertyClaimService.getAllPropertyClaimsOwnedByPlayer(gameId, playerId, jwtUserDetails);
    }

    @GetMapping("/game/{gameId}/listAllUnclaimedPropertyClaims")
    public List<PropertyClaimDTO> getAllUnclaimedPropertyClaimsInGame(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId
    ) {
        return propertyClaimService.getAllUnclaimedPropertyClaimsInGame(gameId, jwtUserDetails);
    }

    @PutMapping("/purchasePropertyClaimFromBank")
    public PropertyClaimDTO purchasePropertyClaimFromBank(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody PurchasePropertyClaimRequestDTO requestDTO
    ) {
        return propertyClaimService.purchasePropertyClaimFromBank(requestDTO, jwtUserDetails);
    }

    @PutMapping("/game/{gameId}/playerId/{playerId}/mortgageProperty/{propertyClaimId}")
    public PropertyClaimDTO mortgageProperty(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId,
            @PathVariable("playerId") long playerId,
            @PathVariable("propertyClaimId") long propertyClaimId
    ) {
        return propertyClaimService.mortgageProperty(gameId, playerId, propertyClaimId, jwtUserDetails);
    }

    @PutMapping("/game/{gameId}/playerId/{playerId}/unmortgageProperty/{propertyClaimId}")
    public PropertyClaimDTO unmortgageProperty(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId,
            @PathVariable("playerId") long playerId,
            @PathVariable("propertyClaimId") long propertyClaimId
    ) {
        return propertyClaimService.unmortgageProperty(gameId, playerId, propertyClaimId, jwtUserDetails);
    }
}
