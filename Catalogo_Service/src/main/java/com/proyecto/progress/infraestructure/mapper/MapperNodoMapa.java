package com.proyecto.progress.infraestructure.mapper;

import com.proyecto.progress.domain.model.NodoMapa;
import com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.nodomapa.NodoMapaData;
import org.springframework.stereotype.Component;

@Component
public class MapperNodoMapa {

    public NodoMapa toNodoMapa(NodoMapaData data) {
        if (data == null) return null;

        return new NodoMapa(
                data.getId(),
                data.getCodigoNodo(),
                data.getNombreNodo(),
                data.getPosicionX(),
                data.getPosicionY(),
                data.getVideoUrl(),
                data.getNombreCientificoPlanta()
        );
    }

    public NodoMapaData toData(NodoMapa nodoMapa) {
        if (nodoMapa == null) return null;

        return new NodoMapaData(
                nodoMapa.getId(),
                nodoMapa.getCodigoNodo(),
                nodoMapa.getNombreNodo(),
                nodoMapa.getPosicionX(),
                nodoMapa.getPosicionY(),
                nodoMapa.getVideoUrl(),
                nodoMapa.getNombreCientificoPlanta()
        );
    }
}
