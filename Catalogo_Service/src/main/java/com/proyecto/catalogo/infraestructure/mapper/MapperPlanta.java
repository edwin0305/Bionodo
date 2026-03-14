package com.proyecto.catalogo.infraestructure.mapper;

import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta.PlantaData;
import jakarta.persistence.Column;
import org.springframework.stereotype.Component;

@Component
public class MapperPlanta {

    public Planta toPlanta(PlantaData plantaData) {
        return new Planta(

        );
    }

    public PlantaData toData(Planta planta) {
        return new PlantaData(

        );
    }
}
