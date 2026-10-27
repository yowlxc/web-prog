package com.example.demo.exception;

public class DuplicateLoginException extends RuntimeException {

    public DuplicateLoginException (String Login) {
        super("Пользователь с Login " + Login + " уже существует");
    }
}
