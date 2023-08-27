package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PropertyClaimDTO implements Serializable {
    private long propertyClaimId;
    private String name;
    private Long cost;
    private String color;
    private Long rentForSite;
    private Long rentForColorGroup;
    private Long rentOneHouseOrRailroad;
    private Long rentTwoHouseOrRailroad;
    private Long rentThreeHouseOrRailroad;
    private Long rentFourHouseOrRailroad;
    private Long rentHotel;
    private Long buildingCost;
    private Long mortgageValue;
    private Long unmortgageValue;
    private boolean isRegularProperty;
    private boolean isRailroad;
    private boolean isUtility;
    private Long gameId;
    private Long ownedByPlayerId;
    private String ownedByPlayerName;
}
