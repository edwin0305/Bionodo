package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.nodomapa;

import com.proyecto.catalogo.domain.model.NodoMapa;
import com.proyecto.catalogo.domain.model.gateway.NodoMapaGateway;
import com.proyecto.catalogo.infraestructure.mapper.MapperNodoMapa;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class NodoMapaDataGatewayImpl implements NodoMapaGateway {

    private final MapperNodoMapa mapperNodoMapa;
    private final NodoMapaJPARepository repository;


    @Override
    public NodoMapa guardarNodo(NodoMapa nodoMapa) {
        NodoMapaData data = mapperNodoMapa.toData(nodoMapa);
        return mapperNodoMapa.toNodoMapa(repository.save(data));
    }

    @Override
    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        NodoMapaData data = repository.finbyCodigoNodo(codigoNodo);
        return data != null ? mapperNodoMapa.toNodoMapa(data) : null;
    }

    @Override
    public List<NodoMapa> listarNodos() {
        return repository.findAll()
                .stream()
                .map(mapperNodoMapa::toNodoMapa)
                .toList();
    }
}
