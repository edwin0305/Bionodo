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
        if (resultado.contains("Ya existe esta planta")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }
        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("buscar/{Nombre_Cientifico}")
    public ResponseEntity<Planta> buscarPorNombreCientifico(@PathVariable String Nombre_Cientifico) {
        try {
            Planta plantaEncontrada = plantaUseCase.buscarPorNombre(Nombre_Cientifico);
            if (plantaEncontrada != null) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            return ResponseEntity.ok(plantaEncontrada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
    @DeleteMapping("/eliminar/{Nombre_Cientifico}")
    public ResponseEntity<String> eliminarPlanta(@PathVariable String Nombre_Cientifico) {
        try{
            Planta planta= plantaUseCase.buscarPorNombre(Nombre_Cientifico);
            if (planta == null) {
                return ResponseEntity.status(HttpStatus.OK).body("La planta con el nombre: "+Nombre_Cientifico+" no existe");
            }
            plantaUseCase.eliminarPlanta(Nombre_Cientifico);
            return ResponseEntity.ok().body("Planta eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/update")
    public ResponseEntity<String> updatePlanta(@RequestBody PlantaData plantaData) {
        Planta planta = mapperPlanta.toPlanta(plantaData);
        Planta plantaActualizada = plantaUseCase.actualizarPlanta(planta);
        return ResponseEntity.ok("Planta actualizada exitosamente");
    }


    @GetMapping("/listar")
    public ResponseEntity<List<Planta>> listarPlantas() {
        return ResponseEntity.ok(plantaUseCase.listarPlantas());
    }
}
