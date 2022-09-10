package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PayRequestDTO {
    private long gameId;
    private String payRequestUUID;
    private long fromId;
    private long toId;
    private long requestInitiatorUserId;
    private boolean isFromSink;
    private boolean isToSink;
    private int amountToPay;
    private int originalFromAmount;
    private int originalToAmount;
}
