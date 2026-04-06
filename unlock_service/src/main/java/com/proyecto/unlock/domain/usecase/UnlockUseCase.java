package com.proyecto.unlock.domain.usecase;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.domain.model.gateway.NodoValidationGateway;
import com.proyecto.unlock.domain.model.gateway.UnlockGateway;
import com.proyecto.unlock.domain.model.gateway.UserValidationGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class UnlockUseCase {

    private final UnlockGateway unlockGateway;
    private final UserValidationGateway userValidationGateway;
    private final NodoValidationGateway nodoValidationGateway;

    public String desbloquearNodo(Unlock unlock) {

        if (unlock.getUserEmail() == null || unlock.getUserEmail().trim().isEmpty()) {
            return "El correo del usuario es obligatorio";
        }

        if (unlock.getCodigoNodo() == null || unlock.getCodigoNodo().trim().isEmpty()) {
            return "El codigoNodo es obligatorio";
        }

        unlock.setUserEmail(unlock.getUserEmail().trim());
        unlock.setCodigoNodo(unlock.getCodigoNodo().trim());

        boolean usuarioExiste = userValidationGateway.existeUsuarioPorCorreo(unlock.getUserEmail());
        if (!usuarioExiste) {
            return "El usuario no existe";
        }

        boolean nodoExiste = nodoValidationGateway.existeNodoPorCodigo(unlock.getCodigoNodo());
        if (!nodoExiste) {
            return "El nodo no existe";
        }

        Unlock existente = unlockGateway.buscarPorUserEmailYCodigoNodo(
                unlock.getUserEmail(),
                unlock.getCodigoNodo()
        );

        if (existente != null) {
            return "Este nodo ya fue desbloqueado por el usuario";
        }

        unlockGateway.guardarUnlock(unlock);

        return "Nodo desbloqueado correctamente";
    }

    public Unlock buscarPorUserEmailYCodigoNodo(String userEmail, String codigoNodo) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return null;
        }

        if (codigoNodo == null || codigoNodo.trim().isEmpty()) {
            return null;
        }

        return unlockGateway.buscarPorUserEmailYCodigoNodo(
                userEmail.trim(),
                codigoNodo.trim()
        );
    }

    public List<Unlock> listarPorUsuario(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return List.of();
        }

        return unlockGateway.listarPorUsuario(userEmail.trim());
    }
}