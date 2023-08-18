package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PurchasePropertyClaimRequestDTO implements Serializable {
    private Long gameId;
    private Long playerId;
    private Long propertyClaimId;
}
