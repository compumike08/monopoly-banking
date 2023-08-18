package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mh.michael.monopolybanking.constants.PlayerRole;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PlayerDTO implements Serializable {
    private long id;
    private String name;
    private String code;
    private long moneyBalance;
    private PlayerRole playerRole;
    private long gameId;
    private List<PropertyClaimDTO> ownedPropertyClaimList;
}
