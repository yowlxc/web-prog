package com.example.demo.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException (long id) {
        super("Пользователь с id " + id + " не найден");
    }
}