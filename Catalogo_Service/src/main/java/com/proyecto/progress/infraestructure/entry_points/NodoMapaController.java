package com.proyecto.progress.infraestructure.entry_points;

import com.proyecto.progress.domain.model.NodoMapa;
import com.proyecto.progress.domain.usecase.NodoMapaUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto/nodomapa")
@RequiredArgsConstructor
public class NodoMapaController {

    private final NodoMapaUseCase nodoMapaUseCase;

    @PostMapping("/save")
    public ResponseEntity<String> saveNodoMapa(@RequestBody NodoMapa nodoMapa) {
        try {
            String resultado = nodoMapaUseCase.guardarNodoMapa(nodoMapa);

            if (resultado.startsWith("NodoMapa guardado")) {
                return new ResponseEntity<>(resultado, HttpStatus.OK);
            }

            return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al guardar el nodo: " + e.getMessage());
        }
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<NodoMapa> buscarPorId(@PathVariable Long id) {
        try {
            NodoMapa nodoMapa = nodoMapaUseCase.buscarPorId(id);

            if (nodoMapa != null) {
                return ResponseEntity.ok(nodoMapa);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar-codigo/{codigoNodo}")
    public ResponseEntity<NodoMapa> buscarPorCodigoNodo(@PathVariable String codigoNodo) {
        try {
            NodoMapa nodoMapa = nodoMapaUseCase.buscarPorCodigoNodo(codigoNodo);

            if (nodoMapa != null) {
                return ResponseEntity.ok(nodoMapa);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateNodoMapa(@RequestBody NodoMapa nodoMapa) {
        try {
            nodoMapaUseCase.actualizarNodoMapa(nodoMapa);
            return ResponseEntity.ok("NodoMapa actualizado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar el nodo: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarNodoMapa(@PathVariable Long id) {
        try {
            String resultado = nodoMapaUseCase.eliminarNodoMapa(id);

            if (resultado.equals("NodoMapa eliminado correctamente")) {
                return ResponseEntity.ok(resultado);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el nodo: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<NodoMapa>> listarNodosMapa() {
        return ResponseEntity.ok(nodoMapaUseCase.listarNodosMapa());
    }
}