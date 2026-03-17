package com.proyecto.catalogo.infraestructure.entry_points;


import com.proyecto.catalogo.domain.model.Insignia;
import com.proyecto.catalogo.domain.usecase.InsigniaUseCase;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.insignia.InsigniaData;
import com.proyecto.catalogo.infraestructure.mapper.MapperInsignia;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proyecto/insignia")
@RequiredArgsConstructor
public class InsigniaController {
    private final InsigniaUseCase insigniaUseCase;
    private final MapperInsignia mapperInsignia;

    @PostMapping("/save")
    public ResponseEntity<?> saveInsignia(@RequestBody InsigniaData insigniaData) {
        Insignia insignia = mapperInsignia.toInsignia(insigniaData);
        String resultado = insigniaUseCase.guardarInsignia(insignia);

        if (resultado.startsWith("Insignia guardada")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }

        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/buscar/{codigoInsignia}")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigoInsignia) {
        Insignia insignia = insigniaUseCase.buscarPorCodigoInsignia(codigoInsignia);

        if (insignia == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(insignia);
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarInsignias() {
        return ResponseEntity.ok(insigniaUseCase.listarInsignias());
    }
}
