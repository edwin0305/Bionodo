package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad UsuarioData.
 * Permite realizar operaciones de persistencia sobre la tabla de administradores.
 */
public interface AdminDataJpaRepository extends JpaRepository<AdminData, String> {
    Optional<AdminData> findByEmail(String email);
}
