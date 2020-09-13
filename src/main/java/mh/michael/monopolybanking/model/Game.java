package mh.michael.monopolybanking.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Game {
    private long gameId;
    private List<User> users;
    private List<MoneySink> moneySinks;
}
