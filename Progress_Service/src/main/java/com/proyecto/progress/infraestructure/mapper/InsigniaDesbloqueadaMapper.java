package com.proyecto.progress.infraestructure.mapper;


import com.proyecto.progress.domain.model.InsigniaDesbloqueada;
import com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.InsigniaDesbloqueada.InsigniaDesbloqueadaData;
import org.springframework.stereotype.Component;

@Component
public class InsigniaDesbloqueadaMapper {

    public InsigniaDesbloqueada toDomain(InsigniaDesbloqueadaData data) {
        return new InsigniaDesbloqueada(
                data.getId(),
                data.getEmailUsuario(),
                data.getCodigoInsignia(),
                data.getFechaObtencion()
        );
    }

    public InsigniaDesbloqueadaData toData(InsigniaDesbloqueada domain) {
        return new InsigniaDesbloqueadaData(
                domain.getId(),
                domain.getEmailUsuario(),
                domain.getCodigoInsignia(),
                domain.getFechaObtencion()
        );
    }
}