package com.proyecto.catalogo.infraestructure.entry_points;

import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.usecase.PlantaUseCase;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta.PlantaData;
import com.proyecto.catalogo.infraestructure.mapper.MapperPlanta;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto/planta")
@RequiredArgsConstructor
public class PlantaController {

    private final PlantaUseCase plantaUseCase;
    private final MapperPlanta mapperPlanta;

    @PostMapping("/save")
    public ResponseEntity<String> savePlanta(@RequestBody PlantaData plantaData) {
        Planta planta = mapperPlanta.toPlanta(plantaData);
        String resultado = plantaUseCase.guardarPlanta(planta);

        if (resultado.startsWith("Planta guardada")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }

        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/buscar/{nombreCientifico}")
    public ResponseEntity<Planta> buscarPorNombreCientifico(@PathVariable String nombreCientifico) {
        try {
            Planta plantaEncontrada = plantaUseCase.buscarPorNombre(nombreCientifico);

            if (plantaEncontrada != null) {
                return ResponseEntity.ok(plantaEncontrada);
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/eliminar/{nombreCientifico}")
    public ResponseEntity<String> eliminarPlanta(@PathVariable String nombreCientifico) {
        try {
            plantaUseCase.eliminarPlanta(nombreCientifico);
            return ResponseEntity.ok("Planta eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al eliminar la planta: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updatePlanta(@RequestBody PlantaData plantaData) {
        try {
            Planta planta = mapperPlanta.toPlanta(plantaData);
            plantaUseCase.actualizarPlanta(planta);
            return ResponseEntity.ok("Planta actualizada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar la planta: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Planta>> listarPlantas() {
        return ResponseEntity.ok(plantaUseCase.listarPlantas());
    }
}