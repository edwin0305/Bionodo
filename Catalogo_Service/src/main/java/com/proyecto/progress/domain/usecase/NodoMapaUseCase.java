package com.proyecto.progress.domain.usecase;

import com.proyecto.progress.domain.model.NodoMapa;
import com.proyecto.progress.domain.model.gateway.NodoMapaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class NodoMapaUseCase {

    private final NodoMapaGateway nodoMapaGateway;

    public String guardarNodoMapa(NodoMapa nodoMapa) {

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

        nodoMapaGateway.guardarNodoMapa(nodoMapa);
        return "NodoMapa guardado correctamente";
    }

    public NodoMapa actualizarNodoMapa(NodoMapa nodoMapa) {
        if (nodoMapa.getId() == null) {
            throw new RuntimeException("El id del nodo es obligatorio para actualizar");
        }
        if (nodoMapa.getCodigoNodo() == null || nodoMapa.getCodigoNodo().trim().isEmpty()) {
            throw new RuntimeException("El código del nodo es obligatorio");
        }
        if (nodoMapa.getNombreNodo() == null || nodoMapa.getNombreNodo().trim().isEmpty()) {
            throw new RuntimeException("El nombre del nodo es obligatorio");
        }
        if (nodoMapa.getPosicionX() == null) {
            throw new RuntimeException("La posición X es obligatoria");
        }
        if (nodoMapa.getPosicionY() == null) {
            throw new RuntimeException("La posición Y es obligatoria");
        }
        if (nodoMapa.getVideoUrl()==null){
            throw new RuntimeException("La url del video es obligatoria");
        }

        NodoMapa nodoExistente = nodoMapaGateway.buscarPorId(nodoMapa.getId());
        if (nodoExistente == null) {
            throw new RuntimeException("NodoMapa no encontrado");
        }

        NodoMapa nodoConMismoCodigo = nodoMapaGateway.buscarPorCodigoNodo(nodoMapa.getCodigoNodo());
        if (nodoConMismoCodigo != null && !nodoConMismoCodigo.getId().equals(nodoMapa.getId())) {
            throw new RuntimeException("Ya existe otro nodo con ese código");
        }

        return nodoMapaGateway.actualizarNodoMapa(nodoMapa);
    }

    public NodoMapa buscarPorId(Long id) {
        try {
            return nodoMapaGateway.buscarPorId(id);
        } catch (Exception e) {
            System.out.println("Error al buscar NodoMapa por id: " + e.getMessage());
            return null;
        }
    }

    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        try {
            return nodoMapaGateway.buscarPorCodigoNodo(codigoNodo);
        } catch (Exception e) {
            System.out.println("Error al buscar NodoMapa por código: " + e.getMessage());
            return null;
        }
    }

    public void eliminarNodoMapa(Long id) {
        NodoMapa nodo = nodoMapaGateway.buscarPorId(id);

        if (nodo == null) {
            throw new RuntimeException("No existe NodoMapa con id: " + id);
        }

        nodoMapaGateway.eliminarPorId(id);
    }

    public List<NodoMapa> listarNodosMapa() {
        return nodoMapaGateway.listarNodosMapa();
    }
}