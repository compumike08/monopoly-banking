package mh.michael.monopolybanking.controller;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.ForgotPasswordRequestDTO;
import mh.michael.monopolybanking.dto.NewUserRequestDTO;
import mh.michael.monopolybanking.dto.ResetPasswordRequestDTO;
import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.exceptions.AuthenticationException;
import mh.michael.monopolybanking.security.JwtTokenRequest;
import mh.michael.monopolybanking.security.JwtTokenResponse;
import mh.michael.monopolybanking.security.JwtTokenUtil;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.EmailSenderService;
import mh.michael.monopolybanking.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins={ "http://localhost:3000", "http://localhost:8080" })
@Slf4j
public class JwtAuthenticationRestController {
    @Value("${jwt.http.request.header}")
    private String tokenHeader;

    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final EmailSenderService emailSenderService;

    public JwtAuthenticationRestController(
            JwtTokenUtil jwtTokenUtil,
            AuthenticationManager authenticationManager,
            UserService userService,
            EmailSenderService emailSenderService
    ) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.emailSenderService = emailSenderService;
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtTokenRequest authenticationRequest)
            throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        final JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        final String token = jwtTokenUtil.generateTokenForAuthentication(userDetails);
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

    @PostMapping(value = "/sendForgotPasswordEmail")
    public ResponseEntity<Boolean> sendForgotPasswordEmail(@RequestBody ForgotPasswordRequestDTO forgotPasswordRequestDTO, HttpServletRequest request) {
        try {
            String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                    .replacePath(null)
                    .build()
                    .toUriString();

            emailSenderService.processForgotEmailRequest(forgotPasswordRequestDTO, baseUrl);
        } catch (Exception e) {
            log.error("send forgot password email exception", e);
        }

        return ResponseEntity.ok(Boolean.TRUE);
    }

    @PostMapping(value = "/resetPassword")
    public UserDTO resetPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        return userService.changeUserPassword(resetPasswordRequestDTO);
    }

    @ExceptionHandler({ AuthenticationException.class })
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}
