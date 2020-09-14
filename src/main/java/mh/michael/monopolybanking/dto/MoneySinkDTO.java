package mh.michael.monopolybanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MoneySinkDTO {
    private long sinkId;
    private String sinkName;
    private int moneyBalance;
    private long gameId;
}
