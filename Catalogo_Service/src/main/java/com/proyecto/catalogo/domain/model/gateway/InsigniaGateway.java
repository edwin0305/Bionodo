package com.proyecto.catalogo.domain.model.gateway;

import com.proyecto.catalogo.domain.model.Insignia;

import java.util.List;

public interface InsigniaGateway {

    Insignia guardarInsignia(Insignia insignia);

    Insignia actualizarInsignia(Insignia insignia);

    Insignia buscarPorId(Long id);

    Insignia buscarPorCodigoInsignia(String codigoInsignia);

    void eliminarPorId(Long id);

    List<Insignia> listarInsignias();
}