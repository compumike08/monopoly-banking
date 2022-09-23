package mh.michael.monopolybanking.security;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.repository.PlayerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DatabaseAuthUserDetailsService implements UserDetailsService {
    private final PlayerRepository playerRepository;

    public DatabaseAuthUserDetailsService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userCode) throws UsernameNotFoundException {
        Player player = playerRepository.findByCode(userCode);

        if (player == null) {
            log.error(String.format("USER NOT FOUND '%s'.", userCode));
            throw new UsernameNotFoundException("User Not Found");
        }

        return new JwtUserDetails(
                player.getId(),
                player.getCode(),
                player.getCode(),
                player.getPlayerRole(),
                player.getGame().getId()
        );
    }
}
