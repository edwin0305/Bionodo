package com.proyecto.progress.infraestructure.entry_points;


import com.proyecto.progress.domain.model.InsigniaDesbloqueada;
import com.proyecto.progress.domain.model.NodoDesbloqueado;
import com.proyecto.progress.domain.model.ResumenProgreso;
import com.proyecto.progress.domain.usecase.ProgressUseCase;
import com.proyecto.progress.infraestructure.entry_points.dto.ApiResponse;
import com.proyecto.progress.infraestructure.entry_points.dto.DesbloquearInsigniaRequest;
import com.proyecto.progress.infraestructure.entry_points.dto.DesbloquearNodoRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto/progreso")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressUseCase progressUseCase;

    @PostMapping("/nodo/desbloquear")
    public ResponseEntity<ApiResponse<NodoDesbloqueado>> desbloquearNodo(
            @RequestBody DesbloquearNodoRequest request) {

        NodoDesbloqueado nodoDesbloqueado = progressUseCase.desbloquearNodo(
                request.getEmailUsuario(),
                request.getCodigoNodo()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Nodo desbloqueado correctamente",
                        nodoDesbloqueado
                ));
    }

    @PostMapping("/insignia/desbloquear")
    public ResponseEntity<ApiResponse<InsigniaDesbloqueada>> desbloquearInsignia(
            @RequestBody DesbloquearInsigniaRequest request) {

        InsigniaDesbloqueada insigniaDesbloqueada = progressUseCase.desbloquearInsignia(
                request.getEmailUsuario(),
                request.getCodigoInsignia()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Insignia desbloqueada correctamente",
                        insigniaDesbloqueada
                ));
    }

    @GetMapping("/usuario/{emailUsuario}/nodos")
    public ResponseEntity<ApiResponse<List<NodoDesbloqueado>>> obtenerNodosPorUsuario(
            @PathVariable String emailUsuario) {

        List<NodoDesbloqueado> nodos = progressUseCase.obtenerNodosPorUsuario(emailUsuario);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Listado de nodos desbloqueados",
                        nodos
                )
        );
    }

    @GetMapping("/usuario/{emailUsuario}/insignias")
    public ResponseEntity<ApiResponse<List<InsigniaDesbloqueada>>> obtenerInsigniasPorUsuario(
            @PathVariable String emailUsuario) {

        List<InsigniaDesbloqueada> insignias = progressUseCase.obtenerInsigniasPorUsuario(emailUsuario);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Listado de insignias desbloqueadas",
                        insignias
                )
        );
    }

    @GetMapping("/usuario/{emailUsuario}/resumen")
    public ResponseEntity<ApiResponse<ResumenProgreso>> obtenerResumen(
            @PathVariable String emailUsuario,
            @RequestParam(defaultValue = "40") int totalNodos) {

        ResumenProgreso resumen = progressUseCase.obtenerResumen(emailUsuario, totalNodos);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Resumen de progreso obtenido correctamente",
                        resumen
                )
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(
                        false,
                        ex.getMessage(),
                        null
                ));
    }
}