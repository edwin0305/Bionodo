package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantaDataJpaRepository extends JpaRepository<PlantaData, Long> {

    Optional<PlantaData> findByNombreCientifico(String nombreCientifico);

}