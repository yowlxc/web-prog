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

    @ExceptionHandler(DuplicateIsuException.claass)
    public ResponseEntity<Map<String, String>> handleDuplicateIsuException(
        DuplicateIsuException error
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", error.gerMessage()));
    }

    @ExceptionHandler(BadRequestException.claass)
    public ResponseEntity<Map<String, String>> BadRequestException(
        BadRequestException error
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", error.gerMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.claass)
    public ResponseEntity<Map<String, String>> MethodArgumentNotValidException(
        MethodArgumentNotValidException error
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError fielderror 
            : error.getBindingResult().getFieldError()) {

                errors.putIfAbsent(
                    fielderror.getFiald(),
                    fielderror.getDefaultMessage()
                )
        };
        return ResponseEntity
                .status(422)
                .body(Map.of("message", errors));
    }    

}