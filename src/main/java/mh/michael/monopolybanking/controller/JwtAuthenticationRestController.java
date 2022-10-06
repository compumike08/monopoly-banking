package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.exceptions.AuthenticationException;
import mh.michael.monopolybanking.security.JwtTokenRequest;
import mh.michael.monopolybanking.security.JwtTokenResponse;
import mh.michael.monopolybanking.security.JwtTokenUtil;
import mh.michael.monopolybanking.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins={ "http://localhost:3000", "http://localhost:8080" })
public class JwtAuthenticationRestController {
    @Value("${jwt.http.request.header}")
    private String tokenHeader;

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService databaseAuthUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public JwtAuthenticationRestController(
            JwtTokenUtil jwtTokenUtil,
            UserDetailsService databaseAuthUserDetailsService,
            AuthenticationManager authenticationManager,
            UserService userService
    ) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.databaseAuthUserDetailsService = databaseAuthUserDetailsService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtTokenRequest authenticationRequest)
            throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtTokenResponse(token));
    }

    @PostMapping(value = "/refresh")
    public ResponseEntity<?> refreshAndGetAuthenticationToken(HttpServletRequest request) {
        String authToken = request.getHeader(tokenHeader);
        final String token = authToken.substring(7);

        if (jwtTokenUtil.canTokenBeRefreshed(token)) {
            String refreshedToken = jwtTokenUtil.refreshToken(token);
            return ResponseEntity.ok(new JwtTokenResponse(refreshedToken));
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping(value = "/registerUser")
    public UserDTO registerNewUser(@RequestBody NewUserRequestDTO newUserRequestDTO) {
        return userService.createNewUser(newUserRequestDTO);
    }

    @ExceptionHandler({ AuthenticationException.class })
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
