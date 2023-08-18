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
    private Long cost;

    @Column(nullable = true)
    private String color;

    @Column(nullable = true)
    private Long rentForSite;

    @Column(nullable = true)
    private Long rentForColorGroup;

    @Column(nullable = true)
    private Long rentOneHouseOrRailroad;

    @Column(nullable = true)
    private Long rentTwoHouseOrRailroad;

    @Column(nullable = true)
    private Long rentThreeHouseOrRailroad;

    @Column(nullable = true)
    private Long rentFourHouseOrRailroad;

    @Column(nullable = true)
    private Long rentHotel;

    @Column(nullable = true)
    private Long buildingCost;

    @Column(nullable = false)
    private Long mortgageValue;

    @Column(nullable = false)
    private Long unmortgageValue;

    @Column(nullable = false)
    private boolean isRegularProperty;

    @Column(nullable = false)
    private boolean isRailroad;

    @Column(nullable = false)
    private boolean isUtility;
}
