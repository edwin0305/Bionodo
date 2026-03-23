package com.proyecto.progress.domain.model.gateway;

import com.proyecto.progress.domain.model.NodoMapa;

import java.util.List;

public interface NodoMapaGateway {

    NodoMapa guardarNodoMapa(NodoMapa nodoMapa);

    NodoMapa actualizarNodoMapa(NodoMapa nodoMapa);

    NodoMapa buscarPorId(Long id);

    NodoMapa buscarPorCodigoNodo(String codigoNodo);

    void eliminarPorId(Long id);

    List<NodoMapa> listarNodosMapa();
}