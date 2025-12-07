package com.changelog.auth.security;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Component
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {
    private String signingKey;
    private String issuer;
    private int accessTokenTtlMinutes = 60;

    public void setSigningKey(String signingKey) { this.signingKey = signingKey; }

    public void setIssuer(String issuer) { this.issuer = issuer; }

    public void setAccessTokenTtlMinutes(int accessTokenTtlMinutes) { this.accessTokenTtlMinutes = accessTokenTtlMinutes; }
}
