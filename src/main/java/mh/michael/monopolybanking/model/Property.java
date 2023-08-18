package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private long cost;

    @Column(nullable = true)
    private String color;

    @Column(nullable = true)
    private long rentForSite;

    @Column(nullable = true)
    private long rentForColorGroup;

    @Column(nullable = true)
    private long rentOneHouseOrRailroad;

    @Column(nullable = true)
    private long rentTwoHouseOrRailroad;

    @Column(nullable = true)
    private long rentThreeHouseOrRailroad;

    @Column(nullable = true)
    private long rentFourHouseOrRailroad;

    @Column(nullable = true)
    private long rentHotel;

    @Column(nullable = true)
    private long buildingCost;

    @Column(nullable = false)
    private long mortgageValue;

    @Column(nullable = false)
    private long unmortgageValue;

    @Column(nullable = false)
    private boolean isRegularProperty;

    @Column(nullable = false)
    private boolean isRailroad;

    @Column(nullable = false)
    private boolean isUtility;
}
