package com.proyecto.catalogo.domain.usecase;

import com.proyecto.catalogo.domain.model.NodoMapa;
import com.proyecto.catalogo.domain.model.gateway.NodoMapaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor

public class NodoMapaUseCase {

    private final NodoMapaGateway nodoMapaGateway;

    public String guardarNodo(NodoMapa nodoMapa) {
        if (nodoMapa.getCodigoNodo() == null || nodoMapa.getCodigoNodo().trim().isEmpty()) {
            return "El código del nodo es obligatorio";
        }
        if (nodoMapa.getNombreNodo() == null || nodoMapa.getNombreNodo().trim().isEmpty()) {
            return "El nombre del nodo es obligatorio";
        }
        if (nodoMapa.getPosicionX() == null) {
            return "La posición X es obligatoria";
        }
        if (nodoMapa.getPosicionY() == null) {
            return "La posición Y es obligatoria";
        }

        NodoMapa existente = nodoMapaGateway.buscarPorCodigoNodo(nodoMapa.getCodigoNodo());
        if (existente != null) {
            return "Ya existe un nodo con ese código";
        }

        nodoMapaGateway.guardarNodo(nodoMapa);
        return "Nodo guardado correctamente";
    }

    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        return nodoMapaGateway.buscarPorCodigoNodo(codigoNodo);
    }

    public List<NodoMapa> listarNodos() {
        return nodoMapaGateway.listarNodos();
    }
}

