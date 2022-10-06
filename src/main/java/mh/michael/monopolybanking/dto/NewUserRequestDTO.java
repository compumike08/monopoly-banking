package mh.michael.monopolybanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewUserRequestDTO {
    private String username;
    private String email;
    private String password;
}
