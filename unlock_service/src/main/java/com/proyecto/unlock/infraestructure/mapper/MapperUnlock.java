package com.proyecto.unlock.infraestructure.mapper;

import com.proyecto.unlock.domain.model.Unlock;
import com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock.UnlockData;
import org.springframework.stereotype.Component;

@Component
public class MapperUnlock {

    public Unlock toUnlock(UnlockData data) {
        if (data == null) return null;

        return new Unlock(
                data.getId(),
                data.getUserEmail(),
                data.getCodigoNodo()
        );
    }

    public UnlockData toData(Unlock unlock) {
        if (unlock == null) return null;

        return new UnlockData(
                unlock.getId(),
                unlock.getUserEmail(),
                unlock.getCodigoNodo()
        );
    }
}