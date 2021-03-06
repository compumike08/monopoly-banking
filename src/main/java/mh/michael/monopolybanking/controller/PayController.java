package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.dto.PayResponseDTO;
import mh.michael.monopolybanking.service.PayService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pay")
public class PayController {
    private final PayService payService;

    public PayController(PayService payService) {
        this.payService = payService;
    }

    @PutMapping()
    public PayResponseDTO payMoney(@RequestBody PayRequestDTO payRequestDTO) {
        return payService.payMoney(payRequestDTO);
    }
}
