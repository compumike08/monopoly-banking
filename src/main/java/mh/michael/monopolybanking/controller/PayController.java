package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.PayService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pay")
public class PayController {
    private final PayService payService;

    public PayController(PayService payService) {
        this.payService = payService;
    }

    @PutMapping()
    public PayResponseDTO payMoney(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody PayRequestDTO payRequestDTO
    ) {
        return payService.payMoney(payRequestDTO, jwtUserDetails);
    }
}
