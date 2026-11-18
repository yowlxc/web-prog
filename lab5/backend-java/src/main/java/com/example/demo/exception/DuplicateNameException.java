package com.example.demo.exception;

public class DuplicateNameException extends RuntimeException {

    public DuplicateNameException(String name) {
        super("Имя пользователя " + name + " уже занято");
    }
}