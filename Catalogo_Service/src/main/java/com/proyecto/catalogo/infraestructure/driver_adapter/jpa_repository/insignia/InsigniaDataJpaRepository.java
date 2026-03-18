package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.insignia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InsigniaDataJpaRepository extends JpaRepository<InsigniaData, Long> {

    Optional<InsigniaData> findByCodigoInsignia(String codigoInsignia);

}