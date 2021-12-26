package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mh.michael.monopolybanking.model.UserRole;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO {
    private long userId;
    private String name;
    private String code;
    private int moneyBalance;
    private UserRole userRole;
    private long gameId;
}
