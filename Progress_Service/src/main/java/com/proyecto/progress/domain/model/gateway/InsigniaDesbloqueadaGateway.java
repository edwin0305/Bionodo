package com.proyecto.progress.domain.model.gateway;



import com.proyecto.progress.domain.model.InsigniaDesbloqueada;

import java.util.List;

public interface InsigniaDesbloqueadaGateway {

    InsigniaDesbloqueada save(InsigniaDesbloqueada insigniaDesbloqueada);

    InsigniaDesbloqueada findByEmailUsuarioAndCodigoInsignia(String emailUsuario, String codigoInsignia);

    List<InsigniaDesbloqueada> findByEmailUsuario(String emailUsuario);

    long countByEmailUsuario(String emailUsuario);
}