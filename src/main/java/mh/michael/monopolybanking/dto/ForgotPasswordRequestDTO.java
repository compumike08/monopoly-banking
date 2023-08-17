package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ForgotPasswordRequestDTO implements Serializable {
    private String email;
}
