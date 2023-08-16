package mh.michael.monopolybanking.controller;

import mh.michael.monopolybanking.dto.UserDTO;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/currentUser")
    public UserDTO getCurrentUser(@AuthenticationPrincipal JwtUserDetails jwtUserDetails) {
        return userService.getCurrentUser(jwtUserDetails);
    }

    @PostMapping("/currentUser/editUser")
    public UserDTO changeUsername(
            @AuthenticationPrincipal JwtUserDetails jwtUserDetails,
            @RequestBody UserDTO requestDTO
    ) {
        return userService.editUser(requestDTO, jwtUserDetails);
    }
}
