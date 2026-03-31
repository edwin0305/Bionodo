package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.nodomapa;

import com.proyecto.progress.domain.model.NodoMapa;
import com.proyecto.progress.domain.model.gateway.NodoMapaGateway;
import com.proyecto.progress.infraestructure.mapper.MapperNodoMapa;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class NodoMapaDataGatewayImpl implements NodoMapaGateway {

    private final NodoMapaDataJpaRepository repository;
    private final MapperNodoMapa mapperNodoMapa;

    @Override
    public NodoMapa guardarNodoMapa(NodoMapa nodoMapa) {
        NodoMapaData data = mapperNodoMapa.toData(nodoMapa);
        return mapperNodoMapa.toNodoMapa(repository.save(data));
    }

    @Override
    public NodoMapa buscarPorId(Long id) {
        return repository.findById(id)
                .map(mapperNodoMapa::toNodoMapa)
                .orElse(null);
    }

    @Override
    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        return repository.findByCodigoNodo(codigoNodo)
                .map(mapperNodoMapa::toNodoMapa)
                .orElse(null);
    }

    @Override
    public NodoMapa actualizarNodoMapa(NodoMapa nodoMapa) {
        NodoMapaData data = mapperNodoMapa.toData(nodoMapa);
        return mapperNodoMapa.toNodoMapa(repository.save(data));
    }

    @Override
    public void eliminarNodoMapa(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<NodoMapa> listarNodosMapa() {
        return repository.findAll()
                .stream()
                .map(mapperNodoMapa::toNodoMapa)
                .toList();
    }
}