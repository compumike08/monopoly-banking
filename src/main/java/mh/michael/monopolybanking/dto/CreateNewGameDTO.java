package mh.michael.monopolybanking.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreateNewGameDTO implements Serializable {
    private boolean isCollectFromFreeParking;
}
