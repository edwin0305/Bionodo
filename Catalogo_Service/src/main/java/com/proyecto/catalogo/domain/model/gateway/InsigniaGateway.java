package com.proyecto.catalogo.domain.model.gateway;

import com.proyecto.catalogo.domain.model.Insignia;

import java.util.List;

public interface InsigniaGateway {
    Insignia guardarInsignia(Insignia insignia);
    Insignia buscarPorCodigoInsignia(String insignia);
    List<Insignia> listarInsignias();

}
