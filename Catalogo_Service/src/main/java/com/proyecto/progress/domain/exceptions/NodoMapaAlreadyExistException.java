package com.proyecto.progress.domain.exceptions;

public class NodoMapaAlreadyExistException extends RuntimeException {
  public NodoMapaAlreadyExistException(String message) {
    super(message);
  }
}
