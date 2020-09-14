package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String code;

    private int moneyBalance;
    private UserRole userRole;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;
}
