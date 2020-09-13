package mh.michael.monopolybanking.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoneySink {
    private long sinkId;
    private String sinkName;
    private int moneyBalance;
}
