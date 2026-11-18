package com.example.demo.exception;

public class DuplicateIsuException extends RuntimeException {

    public DuplicateIsuException(String isu) {
        super("Студент с ИСУ " + isu + " уже существует");
    }
}
