package com.proyecto.users.application.config;

import com.proyecto.users.domain.model.gateway.AdminGateway;
import com.proyecto.users.domain.model.gateway.EncrypterGateway;
import com.proyecto.users.domain.model.gateway.UsuarioGateway;
import com.proyecto.users.domain.usecase.AdminUseCase;
import com.proyecto.users.domain.usecase.UsuarioUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UsuarioUseCaseConfig {

    /**
     * Registra el caso de uso de usuario como un bean de Spring.
     * Se inyectan las dependencias necesarias para la lógica de negocio:
     * el acceso a usuarios y el servicio de encriptación.
     */
    @Bean
    public UsuarioUseCase usuarioUseCase(UsuarioGateway usuarioGateway,
                                         EncrypterGateway encrypterGateway) {
        return new UsuarioUseCase(usuarioGateway, encrypterGateway);
    }

    /**
     * Registra el caso de uso de administrador como un bean de Spring.
     * Se inyectan las dependencias necesarias para la lógica de negocio:
     * el acceso a administradores y el servicio de encriptación.
     */
    @Bean
    public AdminUseCase adminUseCase(AdminGateway adminGateway,
                                     EncrypterGateway encrypterGateway) {
        return new AdminUseCase(adminGateway, encrypterGateway);
    }
}