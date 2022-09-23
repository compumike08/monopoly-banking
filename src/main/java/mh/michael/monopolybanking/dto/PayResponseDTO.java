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
public class PayResponseDTO implements Serializable {
    private long gameId;
    private String payRequestUUID;
    private PlayerDTO fromPlayer;
    private MoneySinkDTO fromMoneySink;
    private PlayerDTO toPlayer;
    private MoneySinkDTO toMoneySink;
    private boolean isFromSink;
    private boolean isToSink;
    private long requestInitiatorPlayerId;
    private long amountPaid;
}
