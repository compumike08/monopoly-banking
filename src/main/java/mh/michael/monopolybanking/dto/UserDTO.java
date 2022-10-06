package mh.michael.monopolybanking.dto;

import lombok.*;
import mh.michael.monopolybanking.constants.EUserRole;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDTO {
    private String username;
    private String email;
    private Set<EUserRole> roles;
}
