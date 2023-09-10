package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProposedTrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "proposing_player_id")
    private Player proposingPlayer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requsted_player_id")
    private Player requestedPlayer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToMany(mappedBy = "offeredInProposedTrade", cascade = CascadeType.ALL)
    private List<PropertyClaim> offeredPropertyClaims = new ArrayList<>();

    @OneToMany(mappedBy = "requestedInProposedTrade", cascade = CascadeType.ALL)
    private List<PropertyClaim> requestedPropertyClaims = new ArrayList<>();
}
