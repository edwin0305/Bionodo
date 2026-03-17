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

    private final NodoMapaJPARepository repository;
    private final MapperNodoMapa mapper;

    @Override
    public NodoMapa guardarNodoMapa(NodoMapa nodoMapa) {
        NodoMapaData data = mapper.toData(nodoMapa);
        return mapper.toNodoMapa(repository.save(data));
    }

    @Override
    public NodoMapa actualizarNodoMapa(NodoMapa nodoMapa) {
        NodoMapaData data = mapper.toData(nodoMapa);
        return mapper.toNodoMapa(repository.save(data));
    }

    @Override
    public NodoMapa buscarPorId(Long id) {
        return repository.findById(id)
                .map(mapper::toNodoMapa)
                .orElse(null);
    }

    @Override
    public NodoMapa buscarPorCodigoNodo(String codigoNodo) {
        return repository.findByCodigoNodo(codigoNodo)
                .map(mapper::toNodoMapa)
                .orElse(null);
    }

    @Override
    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<NodoMapa> listarNodosMapa() {
        return repository.findAll()
                .stream()
                .map(mapper::toNodoMapa)
                .toList();
    }
}