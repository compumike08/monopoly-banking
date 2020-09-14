package mh.michael.monopolybanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewMoneySinkRequestDTO {
    private String sinkName;
    private int moneyBalance;
}
