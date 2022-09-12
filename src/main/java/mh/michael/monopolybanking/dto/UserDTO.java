package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mh.michael.monopolybanking.constants.UserRole;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO implements Serializable {
    private long id;
    private String name;
    private String code;
    private long moneyBalance;
    private UserRole userRole;
    private long gameId;
}
