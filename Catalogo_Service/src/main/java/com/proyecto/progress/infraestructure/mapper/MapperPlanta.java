package com.proyecto.progress.infraestructure.mapper;

import com.proyecto.progress.domain.model.Planta;
import com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.planta.PlantaData;
import org.springframework.stereotype.Component;

@Component
public class MapperPlanta {

    public Planta toPlanta(PlantaData plantaData) {
        return new Planta(
                plantaData.getId(),
                plantaData.getNombreCientifico(),
                plantaData.getNombreComun(),
                plantaData.getMorfologia(),
                plantaData.getOrigen(),
                plantaData.getTipoDeReproduccion(),
                plantaData.getBiodiversidad(),
                plantaData.getBeneficiosAmbientales(),
                plantaData.getRecomendacionesDeCuidado(),
                plantaData.getFotos()
        );
    }

    public PlantaData toData(Planta planta) {
        return new PlantaData(
                planta.getId(),
                planta.getNombreCientifico(),
                planta.getNombreComun(),
                planta.getMorfologia(),
                planta.getOrigen(),
                planta.getTipoDeReproduccion(),
                planta.getBiodiversidad(),
                planta.getBeneficiosAmbientales(),
                planta.getRecomendacionesDeCuidado(),
                planta.getFotos()
        );
    }
}