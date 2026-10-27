package com.example.demo.controller;

import java.time.Duration;
import java.util.Map;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.service.AccessTokenService;
import com.example.demo.service.AuthService;
import com.example.demo.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AccessTokenService accessTokenService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(
            AuthService authService,
            AccessTokenService accessTokenService,
            RefreshTokenService refreshTokenService
    ) {
        this.authService = authService;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(@RequestAttribute("_csrf") CsrfToken token) {
        return Map.of("csrfToken", token.getToken());
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        User user = authService.authenticate(request.login(), request.password());

        String accessToken = accessTokenService.create(user);
        String refreshToken = refreshTokenService.issue(user);

        setRefreshCookie(response, refreshToken, Duration.ofDays(7));

        UserResponse userResponse = new UserResponse(
                user.getId(), user.getName(), user.getLogin(), user.getRole()
        );
        return new AuthResponse(accessToken, userResponse);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @CookieValue(value = "refresh_token", required = false) String token,
            HttpServletResponse response
    ) {
        RefreshTokenService.Rotation rotation = refreshTokenService.rotate(token);
        setRefreshCookie(response, rotation.refreshToken(), Duration.ofDays(7));

        User user = rotation.user();
        return new AuthResponse(
                accessTokenService.create(user),
                new UserResponse(user.getId(), user.getName(), user.getLogin(), user.getRole())
        );
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @CookieValue(value = "refresh_token", required = false) String token,
            HttpServletResponse response
    ) {
        refreshTokenService.revoke(token);
        setRefreshCookie(response, "", Duration.ZERO);
    }

    private void setRefreshCookie(
            HttpServletResponse response,
            String token,
            Duration maxAge
    ) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
