package com.proyecto.unlock.infraestructure.entry_points;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.domain.usecase.UnlockUseCase;
import com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock.UnlockData;
import com.proyecto.unlock.infraestructure.mapper.MapperUnlock;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto/unlock")
@RequiredArgsConstructor
public class UnlockController {

    private final UnlockUseCase unlockUseCase;
    private final MapperUnlock mapperUnlock;

    @PostMapping("/save")
    public ResponseEntity<String> desbloquearNodo(@RequestBody UnlockData unlockData) {

        Unlock unlock = mapperUnlock.toUnlock(unlockData);
        String resultado = unlockUseCase.desbloquearNodo(unlock);

        if (resultado.startsWith("Nodo desbloqueado")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }

        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Unlock> buscarUnlock(
            @RequestParam String userEmail,
            @RequestParam String codigoNodo
    ) {
        Unlock unlock = unlockUseCase.buscarPorUserEmailYCodigoNodo(userEmail, codigoNodo);

        if (unlock == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(unlock);
    }

    @GetMapping("/listar/{userEmail}")
    public ResponseEntity<List<Unlock>> listarPorUsuario(@PathVariable String userEmail) {

        List<Unlock> desbloqueos = unlockUseCase.listarPorUsuario(userEmail);

        return ResponseEntity.ok(desbloqueos);
    }
}