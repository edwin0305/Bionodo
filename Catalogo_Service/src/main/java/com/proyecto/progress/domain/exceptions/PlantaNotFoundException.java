package com.proyecto.progress.domain.exceptions;

public class PlantaNotFoundException extends RuntimeException {
    public PlantaNotFoundException(String message) {
        super(message);
    }
}
