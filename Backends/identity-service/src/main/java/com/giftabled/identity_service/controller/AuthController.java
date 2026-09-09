package com.giftabled.identity_service.controller;

import com.giftabled.identity_service.dto.AuthResponse;
import com.giftabled.identity_service.dto.LoginRequest;
import com.giftabled.identity_service.dto.LoginResponse;
import com.giftabled.identity_service.dto.RegisterRequest;
import com.giftabled.identity_service.security.JwtService;
import com.giftabled.identity_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    private final UserService userService;


    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request){
        return userService.registerUser(request);
    }
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String role= authentication.getAuthorities()
                .stream()
                .findFirst()
                .orElseThrow()
                .getAuthority()
                .replace("ROLE_","");


        String token=jwtService.generateToken(request.getEmail(),role);
        return new LoginResponse(
                "Login successful",
                request.getEmail(),
                role,
                token
        );
    }
}
