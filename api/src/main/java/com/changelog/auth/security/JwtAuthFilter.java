package com.changelog.auth.security;

import com.changelog.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService uds;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            log.debug("No Bearer token on {}", request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            var jws = jwtService.parse(token);
            String email = jws.getBody().getSubject();
            log.debug("Parsed JWT sub={}, iss={}, exp={}", email, jws.getBody().getIssuer(), jws.getBody().getExpiration());

            var userDetails = uds.loadUserByUsername(email); // may throw UsernameNotFoundException
            var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.debug("Authentication set for {}", email);
        } catch (Exception ex) {
            log.warn("JWT auth failed on {}: {}", request.getRequestURI(), ex.toString());
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }
}