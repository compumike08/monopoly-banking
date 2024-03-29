package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GameDTO implements Serializable {
    private long gameId;
    private String code;
    private boolean isCollectFromFreeParking;
    private List<PlayerDTO> players;
    private List<MoneySinkDTO> moneySinks;
}
