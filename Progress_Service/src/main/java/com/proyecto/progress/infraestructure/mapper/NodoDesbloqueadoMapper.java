package com.proyecto.progress.infraestructure.mapper;


import com.proyecto.progress.domain.model.NodoDesbloqueado;
import com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.NodoDesbloqueado.NodoDesbloqueadoData;
import org.springframework.stereotype.Component;

@Component
public class NodoDesbloqueadoMapper {

    public NodoDesbloqueado toDomain(NodoDesbloqueadoData data) {
        return new NodoDesbloqueado(
                data.getId(),
                data.getEmailUsuario(),
                data.getCodigoNodo(),
                data.getFechaDesbloqueo()
        );
    }

    public NodoDesbloqueadoData toData(NodoDesbloqueado domain) {
        return new NodoDesbloqueadoData(
                domain.getId(),
                domain.getEmailUsuario(),
                domain.getCodigoNodo(),
                domain.getFechaDesbloqueo()
        );
    }
}