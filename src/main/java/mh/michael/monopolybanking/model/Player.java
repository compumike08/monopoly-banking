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
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(unique = true)
    private String code;

    private long moneyBalance;
    private String playerRole;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "fromPlayer", cascade = CascadeType.ALL)
    private List<Payment> fromUserPayments = new ArrayList<>();

    @OneToMany(mappedBy = "toPlayer", cascade = CascadeType.ALL)
    private List<Payment> toUserPayments = new ArrayList<>();

    @OneToMany(mappedBy = "requesterPlayer", cascade = CascadeType.ALL)
    private List<Payment> requesterUserPayments = new ArrayList<>();
}
