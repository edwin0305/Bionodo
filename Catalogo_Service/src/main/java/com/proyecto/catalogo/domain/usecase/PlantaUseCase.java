package com.proyecto.catalogo.domain.usecase;

import com.proyecto.catalogo.domain.exceptions.PlantaNotFoundException;
import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PlantaUseCase {
    private final PlantaGateway plantaGateway;

    public String guardarPlanta(Planta planta){

        if (planta.getNombre_cientifico() == null || planta.getNombre_cientifico().trim().isEmpty()){
        return "El Nombre Cientifico es obligatorio";
        }
        if (planta.getNombre_comun()==null || planta.getNombre_comun().trim().isEmpty()){
            return "El campo nombre comun es obligatorio";
        }
        if (planta.getMorfologia()==null || planta.getMorfologia().trim().isEmpty()){
            return "El campo Morfologia es obligatorio";
        }
        if (planta.getOrigen()==null || planta.getOrigen().trim().isEmpty()){
            return "El campo Origen es obligatorio";
        }
        if (planta.getTipo_de_reproduccion()==null || planta.getTipo_de_reproduccion().trim().isEmpty()){
            return "El campo Tipo de reproduccion es obligatorio";
        }

        if (planta.getBiodiversidad()==null || planta.getBiodiversidad().trim().isEmpty()){
            return "El campo Biodiversidad es obligatorio";
        }
        if (planta.getBeneficios_ambientales()==null || planta.getBeneficios_ambientales().trim().isEmpty()){
            return "El campo Beneficios ambientales es obligatorio";
        }
        if (planta.getRecomendaciones_de_cuidado()==null || planta.getRecomendaciones_de_cuidado().trim().isEmpty()){
            return "El campo Recomendaciones del cuidado es obligatorio";
        }
        Planta existente = plantaGateway.buscarPorNombre_Cientifico(planta.getNombre_cientifico());
        if (existente!=null){
            throw new PlantaNotFoundException("Ya existe una planta con esa informacion");
        }
        plantaGateway.guardarPlanta(planta);
        Planta plantaGuardado = plantaGateway.guardarPlanta(planta);



        return "Planta guardada correctamente";



    }
}











