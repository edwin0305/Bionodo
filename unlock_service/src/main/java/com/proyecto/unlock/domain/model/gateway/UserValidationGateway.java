package com.proyecto.unlock.domain.model.gateway;

public interface UserValidationGateway {

    boolean existeUsuarioPorCorreo(String userEmail);
}