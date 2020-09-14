package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "money_sink")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MoneySink {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(unique = true)
    private String sinkName;

    private int moneyBalance;
    private boolean isBank = false;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;
}
