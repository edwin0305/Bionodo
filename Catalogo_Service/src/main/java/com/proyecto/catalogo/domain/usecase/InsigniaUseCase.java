package com.proyecto.catalogo.domain.usecase;

import com.proyecto.catalogo.domain.model.Insignia;
import com.proyecto.catalogo.domain.model.gateway.InsigniaGateway;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class InsigniaUseCase {
    private final InsigniaGateway insigniaGateway;
    public String guardarInsignia(Insignia insignia) {
        if (insignia.getCodigoInsignia() == null || insignia.getCodigoInsignia().trim().isEmpty()) {
            return "El código de la insignia es obligatorio";
        }
        if (insignia.getNombre() == null || insignia.getNombre().trim().isEmpty()) {
            return "El nombre de la insignia es obligatorio";
        }
        if (insignia.getDescripcion() == null || insignia.getDescripcion().trim().isEmpty()) {
            return "La descripción es obligatoria";
        }

        Insignia existente = insigniaGateway.buscarPorCodigoInsignia(insignia.getCodigoInsignia());
        if (existente != null) {
            return "Ya existe una insignia con ese código";
        }

        insigniaGateway.guardarInsignia(insignia);
        return "Insignia guardada correctamente";
    }

    public Insignia buscarPorCodigoInsignia(String codigoInsignia) {
        return insigniaGateway.buscarPorCodigoInsignia(codigoInsignia);
    }

    public List<Insignia> listarInsignias() {
        return insigniaGateway.listarInsignias();
    }

}
