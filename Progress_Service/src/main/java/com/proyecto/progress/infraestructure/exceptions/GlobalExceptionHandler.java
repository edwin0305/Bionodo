package com.proyecto.progress.infraestructure.exceptions;

import com.proyecto.progress.domain.exceptions.CodigoNodoEmptyException;
import com.proyecto.progress.domain.exceptions.EmailEmptyException;
import com.proyecto.progress.domain.exceptions.InsigneaNotFoundException;
import com.proyecto.progress.domain.exceptions.NodoMapaNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {
    @ExceptionHandler(CodigoNodoEmptyException.class)
    public ResponseEntity<String> handleCodigoNodoEmptyException(CodigoNodoEmptyException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(EmailEmptyException.class)
    public ResponseEntity<String> handleEmailEmptyException(EmailEmptyException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(InsigneaNotFoundException.class)
    public ResponseEntity<String> handleInsigneaNotFoundException(InsigneaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
    @ExceptionHandler(NodoMapaNotFoundException.class)
    public ResponseEntity<String> handleNodoMapaNotFoundException(NodoMapaNotFoundException ex){
        return ResponseEntity.status(HttpStatus.OK).body(ex.getMessage());
    }
}
