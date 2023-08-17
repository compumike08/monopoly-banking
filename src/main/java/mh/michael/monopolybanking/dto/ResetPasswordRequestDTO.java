package mh.michael.monopolybanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResetPasswordRequestDTO {
    private String forgotPasswordToken;
    private String newPassword;
}
