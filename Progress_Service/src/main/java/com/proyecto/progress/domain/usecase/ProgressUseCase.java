package com.proyecto.progress.domain.usecase;


import com.proyecto.progress.domain.model.InsigniaDesbloqueada;
import com.proyecto.progress.domain.model.NodoDesbloqueado;
import com.proyecto.progress.domain.model.ResumenProgreso;
import com.proyecto.progress.domain.model.gateway.CatalogoGateway;
import com.proyecto.progress.domain.model.gateway.InsigniaDesbloqueadaGateway;
import com.proyecto.progress.domain.model.gateway.NodoDesbloqueadoGateway;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
public class ProgressUseCase {

    private final NodoDesbloqueadoGateway nodoDesbloqueadoGateway;
    private final InsigniaDesbloqueadaGateway insigniaDesbloqueadaGateway;
    private final CatalogoGateway catalogoGateway;
    private final int unlockStep;
    private final List<String> insigniaCodes;

    public NodoDesbloqueado desbloquearNodo(String emailUsuario, String codigoNodo) {

        if (emailUsuario == null || emailUsuario.isBlank()) {
            throw new RuntimeException("El email del usuario es obligatorio");
        }

        if (codigoNodo == null || codigoNodo.isBlank()) {
            throw new RuntimeException("El código del nodo es obligatorio");
        }

        if (!catalogoGateway.existeNodoPorCodigo(codigoNodo)) {
            throw new RuntimeException("El nodo no existe en el catálogo");
        }

        NodoDesbloqueado existente =
                nodoDesbloqueadoGateway.findByEmailUsuarioAndCodigoNodo(emailUsuario, codigoNodo);

        if (existente != null) {
            return existente;
        }

        NodoDesbloqueado nodo = new NodoDesbloqueado();
        nodo.setEmailUsuario(emailUsuario);
        nodo.setCodigoNodo(codigoNodo);
        nodo.setFechaDesbloqueo(LocalDateTime.now());

        NodoDesbloqueado nodoGuardado = nodoDesbloqueadoGateway.save(nodo);
        long totalDesbloqueados = nodoDesbloqueadoGateway.countByEmailUsuario(emailUsuario);
        asignarInsigniasPorHitos(emailUsuario, totalDesbloqueados);

        return nodoGuardado;
    }

    public InsigniaDesbloqueada desbloquearInsignia(String emailUsuario, String codigoInsignia) {

        if (emailUsuario == null || emailUsuario.isBlank()) {
            throw new RuntimeException("El email del usuario es obligatorio");
        }

        if (codigoInsignia == null || codigoInsignia.isBlank()) {
            throw new RuntimeException("El código de la insignia es obligatorio");
        }

        if (!catalogoGateway.existeInsigniaPorCodigo(codigoInsignia)) {
            throw new RuntimeException("La insignia no existe en el catálogo");
        }

        InsigniaDesbloqueada existente =
                insigniaDesbloqueadaGateway.findByEmailUsuarioAndCodigoInsignia(emailUsuario, codigoInsignia);

        if (existente != null) {
            throw new RuntimeException("La insignia ya fue desbloqueada por este usuario");
        }

        InsigniaDesbloqueada insignia = new InsigniaDesbloqueada();
        insignia.setEmailUsuario(emailUsuario);
        insignia.setCodigoInsignia(codigoInsignia);
        insignia.setFechaObtencion(LocalDateTime.now());

        return insigniaDesbloqueadaGateway.save(insignia);
    }

    public List<NodoDesbloqueado> obtenerNodosPorUsuario(String emailUsuario) {

        if (emailUsuario == null || emailUsuario.isBlank()) {
            throw new RuntimeException("El email del usuario es obligatorio");
        }

        return nodoDesbloqueadoGateway.findByEmailUsuario(emailUsuario);
    }

    public List<InsigniaDesbloqueada> obtenerInsigniasPorUsuario(String emailUsuario) {

        if (emailUsuario == null || emailUsuario.isBlank()) {
            throw new RuntimeException("El email del usuario es obligatorio");
        }

        return insigniaDesbloqueadaGateway.findByEmailUsuario(emailUsuario);
    }

    public ResumenProgreso obtenerResumen(String emailUsuario, int totalNodos) {

        if (emailUsuario == null || emailUsuario.isBlank()) {
            throw new RuntimeException("El email del usuario es obligatorio");
        }

        if (totalNodos < 0) {
            throw new RuntimeException("El total de nodos no puede ser negativo");
        }

        int nodosDesbloqueados = (int) nodoDesbloqueadoGateway.countByEmailUsuario(emailUsuario);
        int insigniasDesbloqueadas = (int) insigniaDesbloqueadaGateway.countByEmailUsuario(emailUsuario);

        double porcentajeProgreso = 0.0;

        if (totalNodos > 0) {
            porcentajeProgreso = ((double) nodosDesbloqueados / totalNodos) * 100;
        }

        return new ResumenProgreso(
                emailUsuario,
                totalNodos,
                nodosDesbloqueados,
                porcentajeProgreso,
                insigniasDesbloqueadas
        );
    }

    private void asignarInsigniasPorHitos(String emailUsuario, long totalDesbloqueados) {
        if (unlockStep <= 0 || insigniaCodes == null || insigniaCodes.isEmpty()) {
            return;
        }

        long hitosGanados = totalDesbloqueados / unlockStep;

        for (int indice = 0; indice < hitosGanados && indice < insigniaCodes.size(); indice++) {
            String codigoInsignia = insigniaCodes.get(indice);

            if (codigoInsignia == null || codigoInsignia.isBlank()) {
                continue;
            }

            String codigoNormalizado = codigoInsignia.trim();

            InsigniaDesbloqueada existente =
                    insigniaDesbloqueadaGateway.findByEmailUsuarioAndCodigoInsignia(emailUsuario, codigoNormalizado);

            if (existente != null) {
                continue;
            }

            if (!catalogoGateway.existeInsigniaPorCodigo(codigoNormalizado)) {
                continue;
            }

            InsigniaDesbloqueada insignia = new InsigniaDesbloqueada();
            insignia.setEmailUsuario(emailUsuario);
            insignia.setCodigoInsignia(codigoNormalizado);
            insignia.setFechaObtencion(LocalDateTime.now());

            insigniaDesbloqueadaGateway.save(insignia);
        }
    }
}
