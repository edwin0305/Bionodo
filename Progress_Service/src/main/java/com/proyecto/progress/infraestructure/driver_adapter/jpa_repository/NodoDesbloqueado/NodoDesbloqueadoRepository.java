package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.NodoDesbloqueado;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NodoDesbloqueadoRepository extends JpaRepository<NodoDesbloqueadoData, Long> {

    Optional<NodoDesbloqueadoData> findByEmailUsuarioAndCodigoNodo(String emailUsuario, String codigoNodo);

    List<NodoDesbloqueadoData> findByEmailUsuario(String emailUsuario);

    long countByEmailUsuario(String emailUsuario);
}