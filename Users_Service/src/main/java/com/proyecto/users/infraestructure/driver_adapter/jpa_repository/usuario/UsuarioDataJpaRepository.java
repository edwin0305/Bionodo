package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad UsuarioData.
 * Permite realizar operaciones de persistencia sobre la tabla de usuarios.
 */
public interface UsuarioDataJpaRepository extends JpaRepository <UsuarioData, String> {
    //cnsulta email a la base de datos
    Optional<UsuarioData>  findByEmail(String email);

}
