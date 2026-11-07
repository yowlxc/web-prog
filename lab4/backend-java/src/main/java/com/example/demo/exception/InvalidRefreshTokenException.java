package com.example.demo.exception;

public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException() {
        super("Недействительный или истёкший refresh токен");
    }
}