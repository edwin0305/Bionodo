package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.NodoDesbloqueado;


import com.proyecto.progress.domain.model.NodoDesbloqueado;
import com.proyecto.progress.domain.model.gateway.NodoDesbloqueadoGateway;
import com.proyecto.progress.infraestructure.mapper.NodoDesbloqueadoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class NodoDesbloqueadoDataGatewayImpl implements NodoDesbloqueadoGateway {

    private final NodoDesbloqueadoRepository repository;
    private final NodoDesbloqueadoMapper mapper;

    @Override
    public NodoDesbloqueado save(NodoDesbloqueado nodoDesbloqueado) {
        return mapper.toDomain(repository.save(mapper.toData(nodoDesbloqueado)));
    }

    @Override
    public NodoDesbloqueado findByEmailUsuarioAndCodigoNodo(String emailUsuario, String codigoNodo) {
        return repository.findByEmailUsuarioAndCodigoNodo(emailUsuario, codigoNodo)
                .map(mapper::toDomain)
                .orElse(null);
    }

    @Override
    public List<NodoDesbloqueado> findByEmailUsuario(String emailUsuario) {
        return repository.findByEmailUsuario(emailUsuario)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public long countByEmailUsuario(String emailUsuario) {
        return repository.countByEmailUsuario(emailUsuario);
    }
}