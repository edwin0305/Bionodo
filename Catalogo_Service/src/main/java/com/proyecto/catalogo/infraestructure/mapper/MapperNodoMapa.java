package com.proyecto.catalogo.infraestructure.mapper;

import com.proyecto.catalogo.domain.model.NodoMapa;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.nodomapa.NodoMapaData;
import org.springframework.stereotype.Component;

@Component
public class MapperNodoMapa {
    public NodoMapa toNodoMapa(NodoMapaData data) {
        return new NodoMapa(
                data.getId(),
                data.getCodigoNodo(),
                data.getNombreNodo(),
                data.getPosicionX(),
                data.getPosicionY(),
                data.getVideoUrl()
        );
    }

    public NodoMapaData toData(NodoMapa nodoMapa) {
        return new NodoMapaData(
                nodoMapa.getId(),
                nodoMapa.getCodigoNodo(),
                nodoMapa.getNombreNodo(),
                nodoMapa.getPosicionX(),
                nodoMapa.getPosicionY(),
                nodoMapa.getVideoUrl()
        );
    }

}
