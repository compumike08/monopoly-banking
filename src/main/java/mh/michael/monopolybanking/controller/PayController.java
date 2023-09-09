package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.PayService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pay")
public class PayController {
    private final PayService payService;

    public PayController(PayService payService) {
        this.payService = payService;
    }

    @GetMapping("/game/{gameId}/list")
    public List<PayResponseDTO> getAllPayments(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @PathVariable("gameId") long gameId
    ) {
        return payService.getPaymentList(gameId, jwtUserDetails);
    }

    @PutMapping()
    public PayResponseDTO payMoney(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody PayRequestDTO payRequestDTO
    ) {
        return payService.payMoney(payRequestDTO, jwtUserDetails, false);
    }
}
