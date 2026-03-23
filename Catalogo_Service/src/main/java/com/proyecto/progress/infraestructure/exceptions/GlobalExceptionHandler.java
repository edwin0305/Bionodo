package com.proyecto.progress.infraestructure.exceptions;

import com.proyecto.progress.domain.exceptions.PlantaNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {
    @ExceptionHandler(PlantaNotFoundException.class)
    public ResponseEntity<String> handlePlantaNotFoundException(PlantaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
