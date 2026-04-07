package com.proyecto.progress.domain.exceptions;

public class EmailEmptyException extends RuntimeException {
    public EmailEmptyException(String message) {
        super(message);
    }
}
