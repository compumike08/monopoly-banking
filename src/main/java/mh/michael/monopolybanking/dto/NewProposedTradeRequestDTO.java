package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewProposedTradeRequestDTO implements Serializable {
    private long gameId;
    private long proposingPlayerId;
    private long requestedPlayerId;
    private List<Long> proposedPropertyClaimIds;
    private List<Long> requestedPropertyClaimIds;
}
