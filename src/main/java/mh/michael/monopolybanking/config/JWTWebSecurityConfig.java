package mh.michael.monopolybanking.config;

import mh.michael.monopolybanking.security.JwtTokenAuthorizationOncePerRequestFilter;
import mh.michael.monopolybanking.security.JwtUnAuthorizedResponseAuthenticationEntryPoint;
import mh.michael.monopolybanking.security.UserCodeAuthenticationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class JWTWebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtUnAuthorizedResponseAuthenticationEntryPoint jwtUnAuthorizedResponseAuthenticationEntryPoint;
    private final UserDetailsService jwtInMemoryUserDetailsService;
    private final JwtTokenAuthorizationOncePerRequestFilter jwtAuthenticationTokenFilter;

    @Value("${jwt.get.token.uri}")
    private String authenticationPath;

    public JWTWebSecurityConfig(
            JwtUnAuthorizedResponseAuthenticationEntryPoint jwtUnAuthorizedResponseAuthenticationEntryPoint,
            UserDetailsService jwtInMemoryUserDetailsService,
            JwtTokenAuthorizationOncePerRequestFilter jwtAuthenticationTokenFilter
    ) {
        this.jwtUnAuthorizedResponseAuthenticationEntryPoint = jwtUnAuthorizedResponseAuthenticationEntryPoint;
        this.jwtInMemoryUserDetailsService = jwtInMemoryUserDetailsService;
        this.jwtAuthenticationTokenFilter = jwtAuthenticationTokenFilter;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(jwtInMemoryUserDetailsService);
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable()
                .exceptionHandling().authenticationEntryPoint(jwtUnAuthorizedResponseAuthenticationEntryPoint).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .anyRequest().authenticated();

        httpSecurity
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        httpSecurity
                .headers()
                .frameOptions().sameOrigin()  //H2 Console Needs this setting
                .cacheControl(); //disable caching
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity
                .ignoring()
                .antMatchers(
                        HttpMethod.POST,
                        "/authenticate"
                )
                .antMatchers(HttpMethod.OPTIONS, "/**")
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.POST,
                        "/ws/**"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.GET,
                        "/ws/**"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.GET,
                        "/"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.POST,
                        "/games/createNewGame"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.POST,
                        "/games/game/**/createNewUser"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.GET,
                        "/games/game/**/user/**"
                )
                .and()
                .ignoring()
                .antMatchers(
                        HttpMethod.GET,
                        "/games/gameCode/**"
                )
                .and()
                .ignoring()
                .antMatchers("/static/**")
                .and()
                .ignoring()
                .antMatchers("/h2-console/**/**");//Should not be in Production!
    }
}
