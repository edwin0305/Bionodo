package com.proyecto.catalogo.domain.exceptions;

public class PlantaNotFoundException extends RuntimeException {
    public PlantaNotFoundException(String message) {
        super(message);
    }
}
