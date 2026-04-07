package com.proyecto.progress.infraestructure.exceptions;

import com.proyecto.progress.domain.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {
    @ExceptionHandler(PlantaNotFoundException.class)
    public ResponseEntity<String> handlePlantaNotFoundException(PlantaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(PlantaEmptyException.class)
    public ResponseEntity<String> handlePlantaEmptyException(PlantaEmptyException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    @ExceptionHandler(PlantaAlreadyExistException.class)
    public ResponseEntity<String> handlePlantaAlreadyExistException(PlantaAlreadyExistException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(InsigneaEmptyException.class)
    public ResponseEntity<String> handleInsigneaEmptyException(InsigneaEmptyException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    @ExceptionHandler(InsigneaAlreadyExistException.class)
    public ResponseEntity<String> handleInsigneaAlreadyExistException(InsigneaAlreadyExistException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(InsigneaNotFoundException.class)
    public ResponseEntity<String> handleInsigneaNotFoundException(InsigneaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(NodoMapaAlreadyExistException.class)
    public ResponseEntity<String> handleNodoMapaAlreadyExistException(NodoMapaAlreadyExistException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(NodoMapaEmptyException.class)
    public ResponseEntity<String> handleNodoMapaEmptyException(NodoMapaEmptyException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    @ExceptionHandler(NodoMapaNotFoundException.class)
    public ResponseEntity<String> handleNodoMapaNotFoundException(NodoMapaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
}
