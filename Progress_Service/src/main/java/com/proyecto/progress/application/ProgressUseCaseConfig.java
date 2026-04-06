package com.proyecto.progress.application;


import com.proyecto.progress.domain.model.gateway.CatalogoGateway;
import com.proyecto.progress.domain.model.gateway.InsigniaDesbloqueadaGateway;
import com.proyecto.progress.domain.model.gateway.NodoDesbloqueadoGateway;
import com.proyecto.progress.domain.usecase.ProgressUseCase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ProgressUseCaseConfig {

    @Bean
    public ProgressUseCase progressUseCase(
            NodoDesbloqueadoGateway nodoDesbloqueadoGateway,
            InsigniaDesbloqueadaGateway insigniaDesbloqueadaGateway,
            CatalogoGateway catalogoGateway,
            @Value("${progress.insignia.unlock-step:5}") int unlockStep,
            @Value("#{'${progress.insignia.codes:INSIGNIA_5_NODOS,INSIGNIA_10_NODOS,INSIGNIA_15_NODOS,INSIGNIA_20_NODOS,INSIGNIA_25_NODOS,INSIGNIA_30_NODOS,INSIGNIA_35_NODOS,INSIGNIA_40_NODOS}'.split(',')}") List<String> insigniaCodes
    ) {
        return new ProgressUseCase(
                nodoDesbloqueadoGateway,
                insigniaDesbloqueadaGateway,
                catalogoGateway,
                unlockStep,
                insigniaCodes
        );
    }
}
