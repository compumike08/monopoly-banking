package mh.michael.monopolybanking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.PAYMENT_REQUIRED)
public class InsufficentFundsException extends RuntimeException {
    public InsufficentFundsException(String message) {
        super(message);
    }
}
