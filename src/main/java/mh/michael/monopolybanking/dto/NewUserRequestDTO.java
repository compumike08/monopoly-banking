package mh.michael.monopolybanking.dto;

import lombok.*;
import mh.michael.monopolybanking.model.UserRole;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewUserRequestDTO {
    private String name;
    private UserRole userRole;
    private long gameId;
}
