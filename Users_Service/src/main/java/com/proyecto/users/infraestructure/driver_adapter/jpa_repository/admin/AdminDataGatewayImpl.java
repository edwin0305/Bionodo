package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin;

import com.proyecto.users.domain.model.Admin;
import com.proyecto.users.domain.model.gateway.AdminGateway;
import com.proyecto.users.infraestructure.mapper.MapperAdmin;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del gateway de administrador.
 * Conecta la lógica de dominio con la persistencia mediante JPA.
 */
@Repository
@RequiredArgsConstructor
public class AdminDataGatewayImpl implements AdminGateway {

    private final AdminDataJpaRepository repository;
    private final MapperAdmin mapper;

    /**
     * Guarda un administrador en la base de datos.
     */
    @Override
    public Admin guardarAdmin(Admin admin) {
        AdminData adminData = mapper.toAdminData(admin);
        return mapper.toAdmin(repository.save(adminData));
    }

    /**
     * Busca un administrador por su correo electrónico.
     * Retorna null si no existe (no se propaga Optional al dominio).
     */
    @Override
    public Admin buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .map(mapper::toAdmin)
                .orElse(null);
    }

    /**
     * Elimina un administrador por su correo.
     */
    @Override
    public void eliminarAdmin(String email) {
        repository.deleteById(email);
    }

    /**
     * Lista todos los administradores registrados.
     */
    @Override
    public List<Admin> listarAdmins() {
        return repository.findAll()
                .stream()
                .map(mapper::toAdmin)
                .collect(Collectors.toList());
    }
}
