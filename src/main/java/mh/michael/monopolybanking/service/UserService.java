package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.constants.EUserRole;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.model.UserRole;
import mh.michael.monopolybanking.repository.UserRoleRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static mh.michael.monopolybanking.util.ConvertDTOUtil.convertUserToUserDTO;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder encoder;

    public UserService(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder encoder
    ) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.encoder = encoder;
    }

    @Transactional
    public UserDTO createNewUser(NewUserRequestDTO newUserRequestDTO) {
        if (userRepository.existsByUsername(newUserRequestDTO.getUsername())) {
            String errMsg = "Username '" + newUserRequestDTO.getUsername() + "' already exists";
            log.debug(errMsg);
            throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
        }

        if (userRepository.existsByEmail(newUserRequestDTO.getEmail())) {
            String errMsg = "Email '" + newUserRequestDTO.getEmail() + "' already exists";
            log.debug(errMsg);
            throw new ResponseStatusException(HttpStatus.CONFLICT, errMsg);
        }

        User newUser = User.builder()
                .username(newUserRequestDTO.getUsername())
                .email(newUserRequestDTO.getEmail())
                .password(encoder.encode(newUserRequestDTO.getPassword()))
                .build();

        Set<UserRole> roles = new HashSet<>();
        Optional<UserRole> optUserUserRole = userRoleRepository.findByName(EUserRole.ROLE_USER);

        if (optUserUserRole.isEmpty()) {
            log.error("Unable to find user role with name of: " + EUserRole.ROLE_USER.name());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An internal server error has occurred");
        }

        roles.add(optUserUserRole.get());
        newUser.setRoles(roles);

        User savedNewUser = userRepository.save(newUser);
        return convertUserToUserDTO(savedNewUser);
    }
}
