package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.insignia;


import com.proyecto.catalogo.domain.model.Insignia;
import com.proyecto.catalogo.domain.model.gateway.InsigniaGateway;
import com.proyecto.catalogo.infraestructure.mapper.MapperInsignia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InsigniaDataGatewayImpl implements InsigniaGateway {
    private final InsigniaJPAReposity repository;
    private final MapperInsignia mapperInsignia;

    @Override
    public Insignia guardarInsignia(Insignia insignia) {
        InsigniaData data = mapperInsignia.toData(insignia);
        return mapperInsignia.toInsignia(repository.save(data));
    }

    @Override
    public Insignia buscarPorCodigoInsignia(String codigoInsignia) {
        InsigniaData data = repository.findByCodigoInsignia(codigoInsignia);
        return data != null ? mapperInsignia.toInsignia(data) : null;
    }

    @Override
    public List<Insignia> listarInsignias() {
        return repository.findAll()
                .stream()
                .map(mapperInsignia::toInsignia)
                .toList();
    }
}



