package com.changelog.auth.service;

import com.changelog.auth.security.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtProperties props;

    private Key key() { return Keys.hmacShaKeyFor(props.getSigningKey().getBytes()); }

    public String issue(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(props.getAccessTokenTtlMinutes() * 60L);
        return Jwts.builder()
                .setIssuer(props.getIssuer())
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
    }
}
