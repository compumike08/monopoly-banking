package mh.michael.monopolybanking.dto;

import lombok.*;
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
