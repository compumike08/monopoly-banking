package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PropertyClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private boolean isMortgaged = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne(optional = true)
    @JoinColumn(name = "owned_by_player_id")
    private Player ownedByPlayer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(optional = true)
    @JoinColumn(name = "offered_in_proposed_trade_id")
    private ProposedTrade offeredInProposedTrade;

    @ManyToOne(optional = true)
    @JoinColumn(name = "requested_in_proposed_trade_id")
    private ProposedTrade requestedInProposedTrade;
}
