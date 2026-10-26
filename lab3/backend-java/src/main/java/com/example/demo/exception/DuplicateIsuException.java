package com.example.demo.exception;

public class DuplicateIsuException extends RuntimeException {

    public DuplicateIsuException (long id) {
        super("Студент с id " + id + " уже существует");
    }
}
