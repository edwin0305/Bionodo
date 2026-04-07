package com.proyecto.progress.domain.usecase;

import com.proyecto.progress.domain.exceptions.PlantaAlreadyExistException;
import com.proyecto.progress.domain.exceptions.PlantaEmptyException;
import com.proyecto.progress.domain.exceptions.PlantaNotFoundException;
import com.proyecto.progress.domain.model.Planta;
import com.proyecto.progress.domain.model.gateway.ArchivoGateway;
import com.proyecto.progress.domain.model.gateway.PlantaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PlantaUseCase {

    private final PlantaGateway plantaGateway;
    private final ArchivoGateway archivoGateway;

    public String guardarPlanta(Planta planta) {

        if (planta.getNombreCientifico() == null || planta.getNombreCientifico().trim().isEmpty()) {
            throw new PlantaEmptyException("El nombre científico es obligatorio");
        }
        if (planta.getNombreComun() == null || planta.getNombreComun().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo nombre común es obligatorio");
        }
        if (planta.getMorfologia() == null || planta.getMorfologia().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo morfología es obligatorio") ;
        }
        if (planta.getOrigen() == null || planta.getOrigen().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo origen es obligatorio");
        }
        if (planta.getTipoDeReproduccion() == null || planta.getTipoDeReproduccion().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo tipo de reproducción es obligatorio");
        }
        if (planta.getBiodiversidad() == null || planta.getBiodiversidad().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo biodiversidad es obligatorio");
        }
        if (planta.getBeneficiosAmbientales() == null || planta.getBeneficiosAmbientales().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo beneficios ambientales es obligatorio") ;
        }
        if (planta.getRecomendacionesDeCuidado() == null || planta.getRecomendacionesDeCuidado().trim().isEmpty()) {
            throw new PlantaEmptyException("El campo recomendaciones de cuidado es obligatorio");
        }

        Planta existente = plantaGateway.buscarPorNombreCientifico(planta.getNombreCientifico());
        if (existente != null) {
            throw new PlantaAlreadyExistException("Ya existe una planta con ese nombre científico");
        }

        plantaGateway.guardarPlanta(planta);

        return "Planta guardada correctamente";
    }

    public String guardarPlanta(Planta planta, List<byte[]> imagenes, List<String> nombresOriginales) {
        List<String> rutas = new java.util.ArrayList<>();

        if (imagenes != null && nombresOriginales != null && imagenes.size() == nombresOriginales.size()) {
            for (int i = 0; i < imagenes.size(); i++) {
                String rutaImagen = archivoGateway.guardarArchivo(
                        imagenes.get(i),
                        nombresOriginales.get(i)
                        ,"plantas");
                rutas.add(rutaImagen);
            }
        }

        planta.setFotos(rutas);
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



