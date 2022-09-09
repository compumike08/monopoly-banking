package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mh.michael.monopolybanking.util.UserRole;

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
