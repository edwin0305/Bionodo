package com.proyecto.unlock.domain.model.gateway;

import com.proyecto.unlock.domain.model.Unlock;

import java.util.List;

public interface UnlockGateway {

    Unlock guardarUnlock(Unlock unlock);

    Unlock buscarPorUserIdYCodigoNodo(Long userId, String codigoNodo);

    List<Unlock> listarPorUsuario(Long userId);
}
