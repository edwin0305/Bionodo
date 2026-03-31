package com.proyecto.unlock.domain.model.gateway;

import com.proyecto.unlock.domain.model.Unlock;

import java.util.List;

public interface UnlockGateway {

    Unlock guardarUnlock(Unlock unlock);

    Unlock buscarPorUserEmailYCodigoNodo(String userEmail, String codigoNodo);

    List<Unlock> listarPorUsuario(String userEmail);
}