package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.InsigniaDesbloqueada;

import com.proyecto.progress.domain.model.InsigniaDesbloqueada;
import com.proyecto.progress.domain.model.gateway.InsigniaDesbloqueadaGateway;
import com.proyecto.progress.infraestructure.mapper.InsigniaDesbloqueadaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InsigniaDesbloqueadaDataGatewayImpl implements InsigniaDesbloqueadaGateway {

    private final InsigniaDesbloqueadaRepository repository;
    private final InsigniaDesbloqueadaMapper mapper;

    @Override
    public InsigniaDesbloqueada save(InsigniaDesbloqueada insigniaDesbloqueada) {
        return mapper.toDomain(repository.save(mapper.toData(insigniaDesbloqueada)));
    }

    @Override
    public InsigniaDesbloqueada findByEmailUsuarioAndCodigoInsignia(String emailUsuario, String codigoInsignia) {
        return repository.findByEmailUsuarioAndCodigoInsignia(emailUsuario, codigoInsignia)
                .map(mapper::toDomain)
                .orElse(null);
    }

    @Override
    public List<InsigniaDesbloqueada> findByEmailUsuario(String emailUsuario) {
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