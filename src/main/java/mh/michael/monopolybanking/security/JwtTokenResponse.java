package mh.michael.monopolybanking.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtTokenResponse implements Serializable {
    private static final long serialVersionUID = 9058760437300668823L;

    private String token;
}
