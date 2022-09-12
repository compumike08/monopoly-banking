package mh.michael.monopolybanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MoneySinkDTO implements Serializable {
    private long id;
    private String name;
    private long moneyBalance;
    private long gameId;
    private boolean isBank;
}
