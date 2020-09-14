package mh.michael.monopolybanking.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GameDTO {
    private long gameId;
    private String code;
    private List<UserDTO> users;
    private List<MoneySinkDTO> moneySinks;
}
