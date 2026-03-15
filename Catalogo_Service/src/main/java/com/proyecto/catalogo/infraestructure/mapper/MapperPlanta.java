package com.proyecto.catalogo.infraestructure.mapper;

import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta.PlantaData;
import org.springframework.stereotype.Component;

@Component
public class MapperPlanta {
    /*private Long id;
    private String nombre_cientifico;
    private String nombre_comun;
    private String morfologia;
    private String origen;
    private String tipo_de_reproduccion;
    private String biodiversidad;
    private String beneficios_ambientales;
    private String recomendaciones_de_cuidado;
    private List<String> fotos;*/
    public Planta toPlanta(PlantaData plantaData) {
        return new Planta(
                plantaData.getId(),
                plantaData.getNombre_cientifico(),
                plantaData.getNombre_comun(),
                plantaData.getMorfologia(),
                plantaData.getOrigen(),
                plantaData.getTipo_de_reproduccion(),
                plantaData.getBiodiversidad(),
                plantaData.getBeneficios_ambientales(),
                plantaData.getRecomendaciones_de_cuidado(),
                plantaData.getFotos()

        );
    }

    public PlantaData toData(Planta planta) {
        return new PlantaData(
                planta.getId(),
                planta.getNombre_cientifico(),
                planta.getNombre_comun(),
                planta.getMorfologia(),
                planta.getOrigen(),
                planta.getTipo_de_reproduccion(),
                planta.getBiodiversidad(),
                planta.getBeneficios_ambientales(),
                planta.getRecomendaciones_de_cuidado(),
                planta.getFotos()

        );
    }
}
