package com.proyecto.users.application.config;

import com.proyecto.users.domain.model.gateway.*;
import com.proyecto.users.domain.usecase.AdminUseCase;
import com.proyecto.users.domain.usecase.UsuarioUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UsuarioUseCaseConfig {

    //por cada caso de uso se agrega eso
    @Bean //indicar a spring que esa clase es un componente
    //por cada caso de uso se agrega eso
    public UsuarioUseCase usuarioUseCase(UsuarioGateway usuarioGateway,
                                         EncrypterGateway encrypterGateway) {
        return new UsuarioUseCase(usuarioGateway, encrypterGateway);
    }

    @Bean
    public AdminUseCase adminUseCase(AdminGateway adminGateway,
                                     EncrypterGateway encrypterGateway)  {
        return new AdminUseCase(adminGateway, encrypterGateway);
    }




}