package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.PayRequestDTO;
import mh.michael.monopolybanking.service.PayService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PaySocketController {
    private final PayService payService;

    public PaySocketController(PayService payService) {
        this.payService = payService;
    }

    @MessageMapping("/paysocket")
    public void greeting(PayRequestDTO payRequestDTO) {
        payService.payMoneySocket(payRequestDTO);
    }
}
