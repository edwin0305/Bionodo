package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.domain.model.gateway.UnlockGateway;
import com.proyecto.unlock.infraestructure.mapper.MapperUnlock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

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
    public Unlock buscarPorUserEmailYCodigoNodo(String userEmail, String codigoNodo) {
        return repository.findByUserEmailAndCodigoNodo(userEmail, codigoNodo)
                .map(mapperUnlock::toUnlock)
                .orElse(null);
    }

    @Override
    public List<Unlock> listarPorUsuario(String userEmail) {
        return repository.findByUserEmail(userEmail)
                .stream()
                .map(mapperUnlock::toUnlock)
                .toList();
    }
}