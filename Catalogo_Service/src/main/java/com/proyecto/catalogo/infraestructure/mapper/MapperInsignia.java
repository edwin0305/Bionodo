package com.proyecto.catalogo.infraestructure.mapper;

import com.proyecto.catalogo.domain.model.Insignia;
import com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.insignia.InsigniaData;
import org.springframework.stereotype.Component;

@Component
public class MapperInsignia {

    public Insignia toInsignia(InsigniaData data) {
        return new Insignia(
                data.getId(),
                data.getCodigoInsignia(),
                data.getNombre(),
                data.getDescripcion(),
                data.getImagenUrl()
        );
    }

    public InsigniaData toData(Insignia insignia) {
        return new InsigniaData(
                insignia.getId(),
                insignia.getCodigoInsignia(),
                insignia.getNombre(),
                insignia.getDescripcion(),
                insignia.getImagenUrl()
        );
    }
}