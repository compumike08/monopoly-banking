package mh.michael.monopolybanking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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

    @JsonProperty
    private boolean isFromSink;

    @JsonProperty
    private boolean isToSink;

    private int amountToPay;
    private int originalFromAmount;
    private int originalToAmount;
}
