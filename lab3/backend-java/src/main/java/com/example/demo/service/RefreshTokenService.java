package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import com.example.demo.model.RefreshToken;
import com.example.demo.model.User;
import com.example.demo.repository.RefreshTokenRepository;
import com.example.demo.exception.InvalidRefreshTokenException;
import org.springframework.stereotype.Service;


@Service
public class RefreshTokenService {

    private static final Duration LIFETIME = Duration.ofDays(7);

    private final RefreshTokenRepository repository;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repository) {
        this.repository = repository;
    }

    public String issue(User user) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);

        // Просто создает удобный токен
        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(token));
        refreshToken.setExpiresAt(Instant.now().plus(LIFETIME));

        repository.save(refreshToken);
        return token;
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException("SHA-256 недоступен", error);
        }
    }

    @Transactional
    public Rotation rotate(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidRefreshTokenException();
        }

        RefreshToken stored = repository.findByTokenHash(hash(token))
                .orElseThrow(() -> new InvalidRefreshTokenException());

        if (!stored.getExpiresAt().isAfter(Instant.now())) {
            throw new InvalidRefreshTokenException();
        }

        User user = stored.getUser();

        if (repository.consume(stored.getId(), stored.getTokenHash()) != 1) {
            throw new InvalidRefreshTokenException();
        }

        return new Rotation(user, issue(user));
    }

    public record Rotation(User user, String refreshToken) {}
}