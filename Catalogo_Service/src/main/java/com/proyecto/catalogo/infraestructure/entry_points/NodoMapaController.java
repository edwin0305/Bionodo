package com.proyecto.catalogo.infraestructure.entry_points;

import com.proyecto.catalogo.domain.model.NodoMapa;
import com.proyecto.catalogo.domain.usecase.NodoMapaUseCase;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.nodomapa.NodoMapaData;
import com.proyecto.catalogo.infraestructure.mapper.MapperNodoMapa;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proyecto/nodo")
@RequiredArgsConstructor
public class NodoMapaController {
    private final NodoMapaUseCase  nodoMapaUseCase;
    private final MapperNodoMapa mapperNodoMapa;
    @PostMapping("/save")
    public ResponseEntity<?> saveNodo(@RequestBody NodoMapaData nodoMapaData) {
        NodoMapa nodoMapa = mapperNodoMapa.toNodoMapa(nodoMapaData);
        String resultado = nodoMapaUseCase.guardarNodo(nodoMapa);

        if (resultado.startsWith("Nodo guardado")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }

        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/buscar/{codigoNodo}")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigoNodo) {
        NodoMapa nodo = nodoMapaUseCase.buscarPorCodigoNodo(codigoNodo);

        if (nodo == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(nodo);
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarNodos() {
        return ResponseEntity.ok(nodoMapaUseCase.listarNodos());
    }

}
