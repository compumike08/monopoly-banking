package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MoneySink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String sinkName;

    private int moneyBalance;
    private boolean isBank = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "GAME_ID")
    private Game game;
}
