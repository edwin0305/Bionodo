package com.proyecto.progress.domain.usecase;

import com.proyecto.progress.domain.exceptions.NodoMapaAlreadyExistException;
import com.proyecto.progress.domain.exceptions.NodoMapaEmptyException;
import com.proyecto.progress.domain.exceptions.NodoMapaNotFoundException;
import com.proyecto.progress.domain.exceptions.PlantaNotFoundException;
import com.proyecto.progress.domain.model.NodoMapa;
import com.proyecto.progress.domain.model.Planta;
import com.proyecto.progress.domain.model.gateway.NodoMapaGateway;
import com.proyecto.progress.domain.model.gateway.PlantaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class NodoMapaUseCase {

    private final NodoMapaGateway nodoMapaGateway;
    private final PlantaGateway plantaGateway;

    public String guardarNodoMapa(NodoMapa nodoMapa) {

        if (nodoMapa.getCodigoNodo() == null || nodoMapa.getCodigoNodo().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El codigoNodo es obligatorio") ;
        }

        if (nodoMapa.getNombreNodo() == null || nodoMapa.getNombreNodo().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El nombreNodo es obligatorio") ;
        }

        if (nodoMapa.getPosicionX() == null) {
            throw new NodoMapaEmptyException("La posicionX es obligatoria") ;
        }

        if (nodoMapa.getPosicionY() == null) {
            throw new NodoMapaEmptyException("La posicionY es obligatoria") ;
        }

        if (nodoMapa.getVideoUrl() == null || nodoMapa.getVideoUrl().trim().isEmpty()) {
            throw new NodoMapaEmptyException("La videoUrl es obligatoria") ;
        }

        if (nodoMapa.getNombreCientificoPlanta() == null || nodoMapa.getNombreCientificoPlanta().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El nombreCientificoPlanta es obligatorio") ;
        }

        NodoMapa existente = nodoMapaGateway.buscarPorCodigoNodo(nodoMapa.getCodigoNodo().trim());

        if (existente != null) {
            throw new NodoMapaAlreadyExistException("Ya existe un nodo con ese codigoNodo");
        }

        Planta plantaExistente = plantaGateway.buscarPorNombreCientifico(
                nodoMapa.getNombreCientificoPlanta().trim()
        );

        if (plantaExistente == null) {
            throw new PlantaNotFoundException("La planta asociada no existe");
        }

        nodoMapaGateway.guardarNodoMapa(nodoMapa);

        return "NodoMapa guardado correctamente";
    }

    public NodoMapa buscarPorId(Long id) {
        return nodoMapaGateway.buscarPorId(id);
    }

    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        if (codigoNodo == null || codigoNodo.trim().isEmpty()) {
            return null;
        }

        return nodoMapaGateway.buscarPorCodigoNodo(codigoNodo.trim());
    }

    public NodoMapa actualizarNodoMapa(NodoMapa nodoMapa) {

        if (nodoMapa.getId() == null) {
            throw new NodoMapaEmptyException("El id es obligatorio para actualizar");
        }

        if (nodoMapa.getCodigoNodo() == null || nodoMapa.getCodigoNodo().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El codigoNodo es obligatorio");
        }

        if (nodoMapa.getNombreNodo() == null || nodoMapa.getNombreNodo().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El nombreNodo es obligatorio");
        }

        if (nodoMapa.getPosicionX() == null) {
            throw new NodoMapaEmptyException("La posicionX es obligatoria");
        }

        if (nodoMapa.getPosicionY() == null) {
            throw new NodoMapaEmptyException("La posicionY es obligatoria");
        }

        if (nodoMapa.getVideoUrl() == null || nodoMapa.getVideoUrl().trim().isEmpty()) {
            throw new NodoMapaEmptyException("La videoUrl es obligatoria");
        }

        if (nodoMapa.getNombreCientificoPlanta() == null || nodoMapa.getNombreCientificoPlanta().trim().isEmpty()) {
            throw new NodoMapaEmptyException("El nombreCientificoPlanta es obligatorio");
        }

        NodoMapa existente = nodoMapaGateway.buscarPorId(nodoMapa.getId());

        if (existente == null) {
            throw new NodoMapaNotFoundException("El nodo no existe");
        }

        Planta plantaExistente = plantaGateway.buscarPorNombreCientifico(
                nodoMapa.getNombreCientificoPlanta().trim()
        );

        if (plantaExistente == null) {
            throw new PlantaNotFoundException("La planta asociada no existe");
        }

        return nodoMapaGateway.actualizarNodoMapa(nodoMapa);
    }

    public String eliminarNodoMapa(Long id) {

        if (id == null) {
            return "El id es obligatorio";
        }

        NodoMapa existente = nodoMapaGateway.buscarPorId(id);

        if (existente == null) {
            throw new NodoMapaNotFoundException("El nodo no existe");
        }

        nodoMapaGateway.eliminarNodoMapa(id);

        return "NodoMapa eliminado correctamente";
    }

    public List<NodoMapa> listarNodosMapa() {
        return nodoMapaGateway.listarNodosMapa();
    }
}