package com.proyecto.progress.infraestructure.entry_points;

import com.proyecto.progress.domain.model.Insignia;
import com.proyecto.progress.domain.model.gateway.ArchivoGateway;
import com.proyecto.progress.domain.usecase.InsigniaUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto/insignia")
@RequiredArgsConstructor
public class InsigniaController {

    private final InsigniaUseCase insigniaUseCase;
    private final ArchivoGateway archivoGateway;

    @PostMapping("/save")
    public ResponseEntity<String> saveInsignia(@RequestBody Insignia insignia) {
        try {
            String resultado = insigniaUseCase.guardarInsignia(insignia);

            if (resultado.startsWith("Insignia guardada")) {
                return new ResponseEntity<>(resultado, HttpStatus.OK);
            }

            return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al guardar la insignia: " + e.getMessage());
        }
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<Insignia> buscarPorId(@PathVariable Long id) {
        try {
            Insignia insignia = insigniaUseCase.buscarPorId(id);

            if (insignia != null) {
                return ResponseEntity.ok(insignia);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar-codigo/{codigoInsignia}")
    public ResponseEntity<Insignia> buscarPorCodigo(@PathVariable String codigoInsignia) {
        try {
            Insignia insignia = insigniaUseCase.buscarPorCodigoInsignia(codigoInsignia);

            if (insignia != null) {
                return ResponseEntity.ok(insignia);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateInsignia(@RequestBody Insignia insignia) {
        try {
            insigniaUseCase.actualizarInsignia(insignia);
            return ResponseEntity.ok("Insignia actualizada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar la insignia: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarInsignia(@PathVariable Long id) {
        try {
            insigniaUseCase.eliminarInsignia(id);
            return ResponseEntity.ok("Insignia eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al eliminar la insignia: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Insignia>> listarInsignias() {
        return ResponseEntity.ok(insigniaUseCase.listarInsignias());
    }

    @PostMapping(value = "/saveimg", consumes = "multipart/form-data")
    public ResponseEntity<String> saveInsigniaConImagen(
            @RequestParam String codigoInsignia,
            @RequestParam String nombreInsignia,
            @RequestParam String descripcion,
            @RequestParam("imagen") MultipartFile imagen
    ) {
        try {
            Insignia insignia = new Insignia();
            insignia.setCodigoInsignia(codigoInsignia);
            insignia.setNombre(nombreInsignia);
            insignia.setDescripcion(descripcion);

            if (imagen != null && !imagen.isEmpty()) {
                String rutaImagen = archivoGateway.guardarArchivo(
                        imagen.getBytes(),
                        imagen.getOriginalFilename(),
                        "insignias"
                );
                insignia.setImagenUrl(rutaImagen);
            }

            String resultado = insigniaUseCase.guardarInsignia(insignia);
            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al guardar la insignia con imagen: " + e.getMessage());
        }
    }
}