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
public class PayResponseDTO {
    private long gameId;
    private String payRequestUUID;
    private UserDTO fromUser;
    private MoneySinkDTO fromMoneySink;
    private UserDTO toUser;
    private MoneySinkDTO toMoneySink;
    private boolean isFromSink;
    private boolean isToSink;
    private long requestInitiatorUserId;
    private int amountPaid;
}
