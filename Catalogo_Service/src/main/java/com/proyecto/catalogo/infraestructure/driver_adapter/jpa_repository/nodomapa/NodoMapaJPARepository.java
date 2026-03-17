package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.nodomapa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NodoMapaRepository extends JpaRepository<NodoMapaData, Long> {
    NodoMapaData finbyCodigoNodo(String codigoNodo);
}
