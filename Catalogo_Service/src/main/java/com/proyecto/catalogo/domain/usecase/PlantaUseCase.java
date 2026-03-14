package com.proyecto.catalogo.domain.usecase;

import com.proyecto.catalogo.domain.exceptions.PlantaNotFoundException;
import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

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
    public Planta buscarPorNombre(String Nombre_Cientifico) {
        try {
            Planta planta = plantaGateway.buscarPorNombre_Cientifico(Nombre_Cientifico);
            return planta; // puede venir nulo si no existe
        } catch (Exception e) {
            System.out.println("Error al buscar Planta: " + e.getMessage());
            return null;
        }
    }
    public void eliminarPlanta(String Nombre_Cientifico) {
        try{
            Planta planta = plantaGateway.buscarPorNombre_Cientifico(Nombre_Cientifico);
            if(planta==null){
                throw new PlantaNotFoundException("No existe Planta con el Nombre cientifico: " + Nombre_Cientifico);
            }
            plantaGateway.eliminarPorNombre_Cientifico(Nombre_Cientifico);
            System.out.println("Planta eliminado con éxito: " + Nombre_Cientifico);
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
    }
    public Planta actualizarPlanta(Planta planta) {
        if (planta.getNombre_cientifico() == null || planta.getNombre_cientifico().trim().isEmpty()) {
            throw new PlantaNotFoundException("El Nombre cientifico es obligatorio para actualizar");
        }

        Planta plantaExistente = plantaGateway.buscarPorNombre_Cientifico(planta.getNombre_cientifico());
        if (plantaExistente == null) {
            // Retorna null si no existe
            throw new PlantaNotFoundException("Planta no encontrada");
        }

        // Mantener el ID original del usuario existente
        planta.setNombre_cientifico(plantaExistente.getNombre_cientifico());

        // Actualizar en base de datos
        return plantaGateway.actualizarPlanta(planta);
    }
    public List<Planta> listarPlantas() {
        return plantaGateway.listarPlantas();
    }


}











