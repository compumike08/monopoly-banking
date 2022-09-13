package mh.michael.monopolybanking.security;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DatabaseAuthUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public DatabaseAuthUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userCode) throws UsernameNotFoundException {
        User user = userRepository.findByCode(userCode);

        if (user == null) {
            log.error(String.format("USER NOT FOUND '%s'.", userCode));
            throw new UsernameNotFoundException("User Not Found");
        }

        return new JwtUserDetails(
                user.getId(),
                user.getCode(),
                user.getCode(),
                user.getUserRole()
        );
    }
}
