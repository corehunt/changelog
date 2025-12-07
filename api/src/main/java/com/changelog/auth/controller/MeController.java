package com.changelog.auth.controller;

import com.changelog.auth.identity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class MeController {

    private final UserRepository users;

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || auth.getName() == null) return ResponseEntity.status(401).build();
        var u = users.findByEmail(auth.getName()).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of(
                "user_id", u.getUserId(),
                "email", u.getEmail()
        ));
    }
}
