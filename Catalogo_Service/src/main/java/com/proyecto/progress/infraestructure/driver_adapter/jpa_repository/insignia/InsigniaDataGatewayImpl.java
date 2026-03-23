package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.insignia;

import com.proyecto.progress.domain.model.Insignia;
import com.proyecto.progress.domain.model.gateway.InsigniaGateway;
import com.proyecto.progress.infraestructure.mapper.MapperInsignia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InsigniaDataGatewayImpl implements InsigniaGateway {

    private final InsigniaDataJpaRepository repository;
    private final MapperInsignia mapperInsignia;

    @Override
    public Insignia guardarInsignia(Insignia insignia) {
        InsigniaData data = mapperInsignia.toData(insignia);
        return mapperInsignia.toInsignia(repository.save(data));
    }

    @Override
    public Insignia actualizarInsignia(Insignia insignia) {
        InsigniaData data = mapperInsignia.toData(insignia);
        return mapperInsignia.toInsignia(repository.save(data));
    }

    @Override
    public Insignia buscarPorId(Long id) {
        return repository.findById(id)
                .map(mapperInsignia::toInsignia)
                .orElse(null);
    }

    @Override
    public Insignia buscarPorCodigoInsignia(String codigoInsignia) {
        return repository.findByCodigoInsignia(codigoInsignia)
                .map(mapperInsignia::toInsignia)
                .orElse(null);
    }

    @Override
    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Insignia> listarInsignias() {
        return repository.findAll()
                .stream()
                .map(mapperInsignia::toInsignia)
                .toList();
    }
}

