package com.proyecto.progress.application;


import com.proyecto.progress.domain.model.gateway.CatalogoGateway;
import com.proyecto.progress.domain.model.gateway.InsigniaDesbloqueadaGateway;
import com.proyecto.progress.domain.model.gateway.NodoDesbloqueadoGateway;
import com.proyecto.progress.domain.usecase.ProgressUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProgressUseCaseConfig {

    @Bean
    public ProgressUseCase progressUseCase(
            NodoDesbloqueadoGateway nodoDesbloqueadoGateway,
            InsigniaDesbloqueadaGateway insigniaDesbloqueadaGateway,
            CatalogoGateway catalogoGateway
    ) {
        return new ProgressUseCase(
                nodoDesbloqueadoGateway,
                insigniaDesbloqueadaGateway,
                catalogoGateway
        );
    }
}