package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import java.util.LinkedHashMap;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleStudentNotFound(
            StudentNotFoundException error
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(
            UserNotFoundException error
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(DuplicateIsuException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateIsuException(
        DuplicateIsuException error
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> AccessDeniedException(
        AccessDeniedException error
    ) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> MethodArgumentNotValidException(
        MethodArgumentNotValidException error
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError fielderror 
            : error.getBindingResult().getFieldErrors()) {

                errors.putIfAbsent(
                    fielderror.getField(),
                    fielderror.getDefaultMessage()
                )
        };
        return ResponseEntity
                .status(422)
                .body(errors);
    }    

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> BadRequestException(
        BadRequestException error
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", error.getMessage()));
    }

}