package com.example.demo.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException (long login) {
        super("Пользователь с id " + id + " не найден");
    }
}