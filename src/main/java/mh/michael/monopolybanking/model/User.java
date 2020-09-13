package mh.michael.monopolybanking.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {
    private long userId;
    private String name;
    private String code;
    private int moneyBalance;
    private UserRole userRole;
}
