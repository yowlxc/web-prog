package com.example.demo.exception;

public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException () {
        super("Недостаточно прав для данного действия");
    }
}
