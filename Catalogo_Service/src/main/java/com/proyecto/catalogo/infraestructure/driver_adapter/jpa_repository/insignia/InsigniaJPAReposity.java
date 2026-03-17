package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.insignia;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InsigniaJPAReposity extends JpaRepository<InsigniaData, Long> {
    InsigniaData findByCodigoInsignia(String codigoInsignia);
}
