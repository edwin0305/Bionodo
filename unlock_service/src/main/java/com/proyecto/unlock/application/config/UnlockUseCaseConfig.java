package com.proyecto.unlock.application.config;

import com.proyecto.unlock.domain.model.gateway.UnlockGateway;
import com.proyecto.unlock.domain.usecase.UnlockUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UnlockUseCaseConfig {

    @Bean
    public UnlockUseCase unlockUseCase(UnlockGateway unlockGateway) {
        return new UnlockUseCase(unlockGateway);
    }
}