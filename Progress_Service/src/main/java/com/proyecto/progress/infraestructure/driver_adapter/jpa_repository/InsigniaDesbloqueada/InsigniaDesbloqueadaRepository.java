package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.InsigniaDesbloqueada;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InsigniaDesbloqueadaRepository extends JpaRepository<InsigniaDesbloqueadaData, Long> {

    Optional<InsigniaDesbloqueadaData> findByEmailUsuarioAndCodigoInsignia(String emailUsuario, String codigoInsignia);

    List<InsigniaDesbloqueadaData> findByEmailUsuario(String emailUsuario);

    long countByEmailUsuario(String emailUsuario);
}