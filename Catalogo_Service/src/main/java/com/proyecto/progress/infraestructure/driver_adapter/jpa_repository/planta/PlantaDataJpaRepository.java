package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.planta;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantaDataJpaRepository extends JpaRepository<PlantaData, Long> {

    Optional<PlantaData> findByNombreCientifico(String nombreCientifico);

}