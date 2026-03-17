package com.proyecto.catalogo.domain.model.gateway;

import com.proyecto.catalogo.domain.model.NodoMapa;

import java.util.List;

public interface NodoMapaGateway {
    NodoMapa guardarNodo(NodoMapa nodoMapa);
    NodoMapa buscarPorCodigoNodo(String codigoNodo);
    List<NodoMapa> listarNodos();
}
