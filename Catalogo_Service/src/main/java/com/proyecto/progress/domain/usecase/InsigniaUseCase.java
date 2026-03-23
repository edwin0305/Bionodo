package com.proyecto.progress.domain.usecase;

import com.proyecto.progress.domain.model.Insignia;
import com.proyecto.progress.domain.model.gateway.InsigniaGateway;
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

        Insignia existente = insigniaGateway.buscarPorCodigoInsignia(insignia.getCodigoInsignia());
        if (existente != null) {
            return "Ya existe una insignia con ese código";
        }

        insigniaGateway.guardarInsignia(insignia);
        return "Insignia guardada correctamente";
    }

    public Insignia actualizarInsignia(Insignia insignia) {

        if (insignia.getId() == null) {
            throw new RuntimeException("El id de la insignia es obligatorio para actualizar");
        }

        if (insignia.getCodigoInsignia() == null || insignia.getCodigoInsignia().trim().isEmpty()) {
            throw new RuntimeException("El código de la insignia es obligatorio");
        }

        if (insignia.getNombre() == null || insignia.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la insignia es obligatorio");
        }

        Insignia existente = insigniaGateway.buscarPorId(insignia.getId());
        if (existente == null) {
            throw new RuntimeException("Insignia no encontrada");
        }

        Insignia mismaCodigo = insigniaGateway.buscarPorCodigoInsignia(insignia.getCodigoInsignia());
        if (mismaCodigo != null && !mismaCodigo.getId().equals(insignia.getId())) {
            throw new RuntimeException("Ya existe otra insignia con ese código");
        }

        return insigniaGateway.actualizarInsignia(insignia);
    }

    public Insignia buscarPorId(Long id) {
        try {
            return insigniaGateway.buscarPorId(id);
        } catch (Exception e) {
            System.out.println("Error al buscar insignia por id: " + e.getMessage());
            return null;
        }
    }

    public Insignia buscarPorCodigoInsignia(String codigoInsignia) {
        try {
            return insigniaGateway.buscarPorCodigoInsignia(codigoInsignia);
        } catch (Exception e) {
            System.out.println("Error al buscar insignia por código: " + e.getMessage());
            return null;
        }
    }

    public void eliminarInsignia(Long id) {

        Insignia insignia = insigniaGateway.buscarPorId(id);

        if (insignia == null) {
            throw new RuntimeException("No existe una insignia con id: " + id);
        }

        insigniaGateway.eliminarPorId(id);
    }

    public List<Insignia> listarInsignias() {
        return insigniaGateway.listarInsignias();
    }
}
