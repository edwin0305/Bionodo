package com.proyecto.progress.domain.model.gateway;



import com.proyecto.progress.domain.model.NodoDesbloqueado;

import java.util.List;

public interface NodoDesbloqueadoGateway {

    NodoDesbloqueado save(NodoDesbloqueado nodoDesbloqueado);

    NodoDesbloqueado findByEmailUsuarioAndCodigoNodo(String emailUsuario, String codigoNodo);

    List<NodoDesbloqueado> findByEmailUsuario(String emailUsuario);

    long countByEmailUsuario(String emailUsuario);
}