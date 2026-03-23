package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.nodomapa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NodoMapaJPARepository extends JpaRepository<NodoMapaData, Long> {

    Optional<NodoMapaData> findByCodigoNodo(String codigoNodo);

}