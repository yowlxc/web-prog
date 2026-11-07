package com.example.demo.exception;

public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException (long isu) {
        super("Студент с isu " + isu + " не найден");
    }
}