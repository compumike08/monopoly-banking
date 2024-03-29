package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.constants.EUserRole;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.ResetPasswordRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.model.UserRole;
import mh.michael.monopolybanking.repository.UserRoleRepository;
import mh.michael.monopolybanking.repository.UserRepository;
import mh.michael.monopolybanking.security.JwtTokenUtil;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.EmailValidationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static mh.michael.monopolybanking.constants.Constants.INTERNAL_SERVER_ERROR_MSG;
import static mh.michael.monopolybanking.util.ConvertDTOUtil.convertUserToUserDTO;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenUtil jwtTokenUtil;

    public UserService(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder encoder,
            JwtTokenUtil jwtTokenUtil
    ) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.encoder = encoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    private void validateUsernameAndEmail(String username, String email) {
        validateUsernameAndEmail(username, email, null);
    }

    private void validateUsernameAndEmail(String username, String email, JwtUserDetails jwtUserDetails) {
        // Validate new username is between 3 and 25 characters long
        if (username.length() < 3 || username.length() > 25) {
            String errMsg = "Username must be at between 3 and 25 characters long";
            log.debug(errMsg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errMsg);
        }

        if (email.length() < 1 || !EmailValidationUtil.emailPatternMatches(email)) {
            log.debug("Email '" + email + "' is missing or invalid");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is missing or invalid");
        }

        if (jwtUserDetails != null) {
            if (!jwtUserDetails.getUsername().equals(username) && userRepository.existsByUsername(username)) {
                log.debug("Username '" + username + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }

            if (!jwtUserDetails.getEmail().equals(email) && userRepository.existsByEmail(email)) {
                log.debug("Email '" + email + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
        } else {
            if (userRepository.existsByUsername(username)) {
                log.debug("Username '" + username + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }

            if (userRepository.existsByEmail(email)) {
                log.debug("Email '" + email + "' already exists");
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
        }
    }

    @Transactional
    public UserDTO createNewUser(NewUserRequestDTO newUserRequestDTO) {
        validateUsernameAndEmail(newUserRequestDTO.getUsername(), newUserRequestDTO.getEmail());

        User newUser = User.builder()
                .username(newUserRequestDTO.getUsername())
                .email(newUserRequestDTO.getEmail())
                .password(encoder.encode(newUserRequestDTO.getPassword()))
                .userUuid(UUID.randomUUID())
                .build();

        Set<UserRole> roles = new HashSet<>();
        Optional<UserRole> optUserUserRole = userRoleRepository.findByName(EUserRole.ROLE_USER);

        if (optUserUserRole.isEmpty()) {
            log.error("Unable to find user role with name of: " + EUserRole.ROLE_USER.name());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        roles.add(optUserUserRole.get());
        newUser.setRoles(roles);

        User savedNewUser = userRepository.save(newUser);
        return convertUserToUserDTO(savedNewUser);
    }

    @Transactional
    public UserDTO getCurrentUser(JwtUserDetails jwtUserDetails) {
        Optional<User> optUser = userRepository.findByUsername(jwtUserDetails.getUsername());

        if (optUser.isEmpty()) {
            log.error("Unable to find user with username of: " + jwtUserDetails.getUsername());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MSG);
        }

        User user = optUser.get();
        return convertUserToUserDTO(user);
    }

    @Transactional
    public UserDTO editUser(UserDTO requestDTO, JwtUserDetails jwtUserDetails) {
        validateUsernameAndEmail(requestDTO.getUsername(), requestDTO.getEmail(), jwtUserDetails);

        User user = userRepository.getOne(jwtUserDetails.getId());

        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());

        User savedUser = userRepository.save(user);
        return convertUserToUserDTO(savedUser);
    }

    @Transactional
    public UserDTO changeUserPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {
        String email = jwtTokenUtil.getSubjectFromToken(resetPasswordRequestDTO.getForgotPasswordToken());

        Optional<User> optUser = userRepository.findByEmail(email);

        if (optUser.isEmpty()) {
            log.error("Cannot find email from forgot password token");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        User user = optUser.get();

        if (!jwtTokenUtil.validateTokenForForgotPassword(resetPasswordRequestDTO.getForgotPasswordToken(), user)) {
            log.error("Forgot password token is invalid");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        user.setPassword(encoder.encode(resetPasswordRequestDTO.getNewPassword()));
        User savedUser = userRepository.save(user);
        return convertUserToUserDTO(savedUser);
    }
}
