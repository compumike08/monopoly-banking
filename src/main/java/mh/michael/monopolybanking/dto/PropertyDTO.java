package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PropertyDTO implements Serializable {
    private long id;
    private String name;
    private long cost;
    private String color;
    private long rentForSite;
    private long rentForColorGroup;
    private long rentOneHouseOrRailroad;
    private long rentTwoHouseOrRailroad;
    private long rentThreeHouseOrRailroad;
    private long rentFourHouseOrRailroad;
    private long rentHotel;
    private long buildingCost;
    private long mortgageValue;
    private long unmortgageValue;
    private boolean isRegularProperty;
    private boolean isRailroad;
    private boolean isUtility;
}
