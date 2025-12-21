package com.changelog.auth.service;

import com.changelog.auth.dto.AuthResponse;
import com.changelog.auth.dto.LoginRequest;
import com.changelog.auth.dto.RegisterRequest;
import com.changelog.auth.identity.User;
import com.changelog.auth.identity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwt;

    public AuthResponse register(RegisterRequest req) {
        long userCount = users.count();

        if (userCount < 1) {
            String email = req.getEmail().toLowerCase();
            if (users.existsByEmail(email)) {
                throw new IllegalArgumentException("email_already_exists");
            }
            User u = User.builder()
                    .email(email)
                    .passwordHash(encoder.encode(req.getPassword()))
                    .build();
            users.save(u);

            String token = jwt.issue(
                    u.getEmail(),
                    Map.of("uid", u.getUserId().toString(), "role", "USER")
            );
            return new AuthResponse(token);
        } else {
            throw new IllegalStateException("No longer accepting new users. ");
        }

    }

    public AuthResponse login(LoginRequest req) {
        String email = req.getEmail().toLowerCase();
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, req.getPassword())
        );
        var u = users.findByEmail(email).orElseThrow();
        String token = jwt.issue(
                u.getEmail(),
                Map.of("uid", u.getUserId().toString(), "role", "USER")
        );
        return new AuthResponse(token);
    }
}
