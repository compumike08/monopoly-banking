package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PayRequestDTO implements Serializable {
    private long gameId;
    private String payRequestUUID;
    private long fromId;
    private long toId;
    private long requestInitiatorPlayerId;
    private boolean isFromSink;
    private boolean isToSink;
    private long amountToPay;
    private long originalFromAmount;
    private long originalToAmount;
}
