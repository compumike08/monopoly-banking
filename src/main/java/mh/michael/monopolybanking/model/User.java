package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(unique = true)
    private String code;

    private int moneyBalance;
    private UserRole userRole;

    @ManyToOne(optional = false)
    @JoinColumn(name = "GAME_ID")
    private Game game;
}
