package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.LinkedHashMap;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

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

    @ExceptionHandler(DuplicateLoginException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateLoginException(
        DuplicateLoginException error
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

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(
            InvalidCredentialsException error
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRefreshTokenException(
        InvalidRefreshTokenException error
    ) {
        return ResponseEntity
                .status(401)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> MethodArgumentNotValidException(
        MethodArgumentNotValidException error
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError fielderror 
            : error.getBindingResult().getFieldErrors()) {

                errors.putIfAbsent(
                    fielderror.getField(),
                    fielderror.getDefaultMessage()
                );
        };
        log.warn("Ошибка валидации запроса: {}", errors.keySet());
        return ResponseEntity
                .status(422)
                .body(Map.of("message", "Ошибка валидации", "errors", errors));
    }    

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> BadRequestException(
        BadRequestException error
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", error.getMessage()));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Map<String, String>> invalidRequest(Exception error) {
        log.warn("Некорректный запрос: {}", error.getClass().getSimpleName());
        return ResponseEntity.badRequest().body(Map.of("message", "Некорректные данные запроса"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> unexpectedError(Exception error) {
        log.error("Ошибка сервера", error);
        return ResponseEntity.status(500).body(Map.of("message", "Ошибка сервера"));
    }

}
