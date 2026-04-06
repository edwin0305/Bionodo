package com.proyecto.progress.domain.model.gateway;

import com.proyecto.progress.domain.model.NodoMapa;

import java.util.List;

public interface NodoMapaGateway {

    NodoMapa guardarNodoMapa(NodoMapa nodoMapa);

    NodoMapa buscarPorId(Long id);

    NodoMapa buscarPorCodigoNodo(String codigoNodo);

    NodoMapa actualizarNodoMapa(NodoMapa nodoMapa);

    void eliminarNodoMapa(Long id);

    List<NodoMapa> listarNodosMapa();
}