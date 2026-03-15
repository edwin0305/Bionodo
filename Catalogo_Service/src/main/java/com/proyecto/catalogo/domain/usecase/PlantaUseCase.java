package com.proyecto.catalogo.domain.usecase;

import com.proyecto.catalogo.domain.exceptions.PlantaNotFoundException;
import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.model.gateway.ArchivoGateway;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PlantaUseCase {

    private final PlantaGateway plantaGateway;
    private final ArchivoGateway archivoGateway;

    public String guardarPlanta(Planta planta) {

        if (planta.getNombreCientifico() == null || planta.getNombreCientifico().trim().isEmpty()) {
            return "El nombre científico es obligatorio";
        }
        if (planta.getNombreComun() == null || planta.getNombreComun().trim().isEmpty()) {
            return "El campo nombre común es obligatorio";
        }
        if (planta.getMorfologia() == null || planta.getMorfologia().trim().isEmpty()) {
            return "El campo morfología es obligatorio";
        }
        if (planta.getOrigen() == null || planta.getOrigen().trim().isEmpty()) {
            return "El campo origen es obligatorio";
        }
        if (planta.getTipoDeReproduccion() == null || planta.getTipoDeReproduccion().trim().isEmpty()) {
            return "El campo tipo de reproducción es obligatorio";
        }
        if (planta.getBiodiversidad() == null || planta.getBiodiversidad().trim().isEmpty()) {
            return "El campo biodiversidad es obligatorio";
        }
        if (planta.getBeneficiosAmbientales() == null || planta.getBeneficiosAmbientales().trim().isEmpty()) {
            return "El campo beneficios ambientales es obligatorio";
        }
        if (planta.getRecomendacionesDeCuidado() == null || planta.getRecomendacionesDeCuidado().trim().isEmpty()) {
            return "El campo recomendaciones de cuidado es obligatorio";
        }

        Planta existente = plantaGateway.buscarPorNombreCientifico(planta.getNombreCientifico());
        if (existente != null) {
            throw new PlantaNotFoundException("Ya existe una planta con ese nombre científico");
        }

        plantaGateway.guardarPlanta(planta);

        return "Planta guardada correctamente";
    }

    public String guardarPlanta(Planta planta, byte[] imagen, String nombreOriginal) {
        String rutaImagen = archivoGateway.guardarArchivo(imagen, nombreOriginal);
        planta.setFotos(List.of(rutaImagen));

        return guardarPlanta(planta);
    }

    public Planta buscarPorNombre(String nombreCientifico) {
        try {
            return plantaGateway.buscarPorNombreCientifico(nombreCientifico);
        } catch (Exception e) {
            System.out.println("Error al buscar planta: " + e.getMessage());
            return null;
        }
    }

    public void eliminarPlanta(String nombreCientifico) {
        Planta planta = plantaGateway.buscarPorNombreCientifico(nombreCientifico);

        if (planta == null) {
            throw new PlantaNotFoundException("No existe planta con el nombre científico: " + nombreCientifico);
        }

        if (planta.getFotos() != null && !planta.getFotos().isEmpty()) {
            for (String rutaFoto : planta.getFotos()) {
                archivoGateway.eliminarArchivo(rutaFoto);
            }
        }

        plantaGateway.eliminarPorNombreCientifico(nombreCientifico);
    }

    public Planta actualizarPlanta(Planta planta) {
        if (planta.getNombreCientifico() == null || planta.getNombreCientifico().trim().isEmpty()) {
            throw new PlantaNotFoundException("El nombre científico es obligatorio para actualizar");
        }

        Planta plantaExistente = plantaGateway.buscarPorNombreCientifico(planta.getNombreCientifico());
        if (plantaExistente == null) {
            throw new PlantaNotFoundException("Planta no encontrada");
        }

        // Mantener el ID original para que se actualice el registro correcto
        planta.setId(plantaExistente.getId());

        return plantaGateway.actualizarPlanta(planta);
    }

    public List<Planta> listarPlantas() {
        return plantaGateway.listarPlantas();
    }
}



