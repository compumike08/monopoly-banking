package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProposedTradeDTO implements Serializable {
    private long proposedTradeId;
    private PlayerDTO proposingPlayer;
    private PlayerDTO requestedPlayer;
    private long amountMoneyOffered;
    private long amountMoneyRequested;
    private List<PropertyClaimDTO> offeredPropertyClaims;
    private List<PropertyClaimDTO> requestedPropertyClaims;

    // These properties are for sending websocket messages
    private boolean isProposedTradeCreated = false;
    private boolean isProposedTradeCancelled = false;
    private boolean isProposedTradeAccepted = false;
    private boolean isProposedTradeRejected = false;
}
