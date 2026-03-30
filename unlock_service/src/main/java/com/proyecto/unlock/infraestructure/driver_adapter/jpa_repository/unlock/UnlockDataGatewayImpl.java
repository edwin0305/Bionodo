package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.domain.model.gateway.UnlockGateway;
import com.proyecto.unlock.infraestructure.mapper.MapperUnlock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;
@Repository
@RequiredArgsConstructor
public class UnlockDataGatewayImpl implements UnlockGateway {
    private final UnlockDataJpaRepository repository;
    private final MapperUnlock mapperUnlock;


    @Override
    public Unlock guardarUnlock(Unlock unlock) {
        UnlockData data = mapperUnlock.toData(unlock);
        return mapperUnlock.toUnlock(repository.save(data));
    }

    @Override
    public Unlock buscarPorUserIdYCodigoNodo(Long userId, String codigoNodo) {
        UnlockData data = repository.findByUserIdAndCodigoNodo(userId, codigoNodo);
        return data != null ? mapperUnlock.toUnlock(data) : null;
    }

    @Override
    public List<Unlock> listarPorUsuario(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(mapperUnlock::toUnlock)
                .collect(Collectors.toList());
    }
}

