package com.example.demo.exception;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException (String Email) {
        super("Пользователь с Email " + Email + " уже существует");
    }
}
