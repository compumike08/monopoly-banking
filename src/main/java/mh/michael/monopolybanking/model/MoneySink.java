package mh.michael.monopolybanking.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    private long moneyBalance;
    private boolean isBank = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToMany(mappedBy = "fromMoneySink", cascade = CascadeType.ALL)
    private List<Payment> fromMoneySinkPayments = new ArrayList<>();

    @OneToMany(mappedBy = "toMoneySink", cascade = CascadeType.ALL)
    private List<Payment> toMoneySinkPayments = new ArrayList<>();
}
