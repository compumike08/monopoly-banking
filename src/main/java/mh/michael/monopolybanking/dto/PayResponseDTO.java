package mh.michael.monopolybanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PayResponseDTO {
    private String payRequestUUID;
    private UserDTO fromUser;
    private MoneySinkDTO fromMoneySink;
    private UserDTO toUser;
    private MoneySinkDTO toMoneySink;
    private boolean isFromSink;
    private boolean isToSink;
    private long requestInitiatorUserId;
}
