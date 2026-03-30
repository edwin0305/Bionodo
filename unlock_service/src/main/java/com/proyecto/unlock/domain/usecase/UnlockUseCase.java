package com.proyecto.unlock.domain.usecase;
import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.domain.model.gateway.UnlockGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class UnlockUseCase {

    private final UnlockGateway unlockGateway;

    public String desbloquearNodo(Unlock unlock) {
        if (unlock.getUserId() == null) {
            return "El userId es obligatorio";
        }

        if (unlock.getCodigoNodo() == null || unlock.getCodigoNodo().trim().isEmpty()) {
            return "El codigoNodo es obligatorio";
        }

        Unlock existente = unlockGateway.buscarPorUserIdYCodigoNodo(unlock.getUserId(), unlock.getCodigoNodo());

        if (existente != null) {
            return "Este nodo ya fue desbloqueado por el usuario";
        }

        unlock.setDesbloqueado(true);
        unlockGateway.guardarUnlock(unlock);

        return "Nodo desbloqueado correctamente";
    }

    public Unlock buscarPorUserIdYCodigoNodo(Long userId, String codigoNodo) {
        return unlockGateway.buscarPorUserIdYCodigoNodo(userId, codigoNodo);
    }

    public List<Unlock> listarPorUsuario(Long userId) {
        return unlockGateway.listarPorUsuario(userId);
    }
}