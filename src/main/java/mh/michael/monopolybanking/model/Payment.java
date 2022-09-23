package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Payment {
    @Id
    private String payRequestUuid;

    private boolean isFromSink;
    private boolean isToSink;
    private long amountPaid;

    @ManyToOne
    @JoinColumn(name = "from_player_id")
    private Player fromPlayer;

    @ManyToOne
    @JoinColumn(name = "from_money_sink_id")
    private MoneySink fromMoneySink;

    @ManyToOne
    @JoinColumn(name = "to_player_id")
    private Player toPlayer;

    @ManyToOne
    @JoinColumn(name = "to_money_sink_id")
    private MoneySink toMoneySink;

    @ManyToOne
    @JoinColumn(name = "requester_player_id")
    private Player requesterPlayer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;
}
