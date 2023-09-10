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
    private long proposingPlayerId;
    private long requestedPlayerId;
    private List<PropertyClaimDTO> offeredPropertyClaims;
    private List<PropertyClaimDTO> requestedPropertyClaims;
}
