package com.giftabled.attendance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("message", exception.getMessage());

        HttpStatus status;

        if (exception.getMessage() != null &&
                exception.getMessage().contains("already marked")) {

            status = HttpStatus.CONFLICT;

        } else if (exception.getMessage() != null &&
                (exception.getMessage().contains("outside the allowed location")
                        || exception.getMessage().contains("Invalid QR token"))) {

            status = HttpStatus.BAD_REQUEST;

        } else {

            status = HttpStatus.NOT_FOUND;
        }

        response.put("status", status.value());

        return new ResponseEntity<>(response, status);
    }
}