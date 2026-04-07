package com.proyecto.progress.domain.exceptions;

public class PlantaAlreadyExistException extends RuntimeException {
  public PlantaAlreadyExistException(String message) {
    super(message);
  }
}
