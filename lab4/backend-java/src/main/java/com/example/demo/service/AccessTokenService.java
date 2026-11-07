package com.example.demo.service;

import java.time.Duration;
import java.time.Instant;

import com.example.demo.model.User;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class AccessTokenService {

    private final JwtEncoder jwtEncoder;

    public AccessTokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String create(User user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("student-app")
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofMinutes(15)))
                .claim("role", user.getRole().name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder
                .encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }
}