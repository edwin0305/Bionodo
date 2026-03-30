package com.proyecto.unlock.infraestructure.mapper;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock.UnlockData;
import org.springframework.stereotype.Component;

@Component
public class MapperUnlock {

    public Unlock toUnlock(UnlockData data) {
        return new Unlock(
                data.getId(),
                data.getUserId(),
                data.getCodigoNodo(),
                data.isDesbloqueado()
        );
    }

    public UnlockData toData(Unlock unlock) {
        return new UnlockData(
                unlock.getId(),
                unlock.getUserId(),
                unlock.getCodigoNodo(),
                unlock.getDesbloqueado()
        );
    }
}