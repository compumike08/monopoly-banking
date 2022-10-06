package mh.michael.monopolybanking.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mh.michael.monopolybanking.model.Player;
import mh.michael.monopolybanking.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class JwtUserDetails implements UserDetails {
    private static final long serialVersionUID = -8535605411284956079L;

    private final Long id;
    private final String username;
    private final String email;
    private final String password;
    private final List<Long> gameIdList;
    private final List<Long> playerIdList;
    private final Collection<? extends GrantedAuthority> authorities;

    public JwtUserDetails(Long id, String username, String email, String password,
                          List<Long> gameIdList, List<Long> playerIdList,
                          Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.gameIdList = gameIdList;
        this.playerIdList = playerIdList;
        this.authorities = authorities;
    }

    public static JwtUserDetails build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        List<Player> authorizedPlayersList = user.getPlayersList();
        List<Long> authorizedPlayerIdsList = authorizedPlayersList.parallelStream()
                .map(Player::getId)
                .collect(Collectors.toList());
        List<Long> authorizedGameIdsList = authorizedPlayersList.parallelStream()
                .map(player -> player.getGame().getId())
                .collect(Collectors.toList());

        return new JwtUserDetails(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorizedGameIdsList,
                authorizedPlayerIdsList,
                authorities);
    }

    @JsonIgnore
    public Long getId() {
        return id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getEmail() { return email; }

    public List<Long> getGameIdList() { return gameIdList; }

    public List<Long> getPlayerIdList() { return playerIdList; }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
