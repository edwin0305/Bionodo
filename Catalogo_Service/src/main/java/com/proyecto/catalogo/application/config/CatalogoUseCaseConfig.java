package com.proyecto.catalogo.application.config;

import com.proyecto.catalogo.domain.model.gateway.ArchivoGateway;
import com.proyecto.catalogo.domain.model.gateway.InsigniaGateway;
import com.proyecto.catalogo.domain.model.gateway.NodoMapaGateway;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import com.proyecto.catalogo.domain.usecase.InsigniaUseCase;
import com.proyecto.catalogo.domain.usecase.NodoMapaUseCase;
import com.proyecto.catalogo.domain.usecase.PlantaUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CatalogoUseCaseConfig {//por cada caso de uso se agrega eso
    @Bean //indicar a spring que esa clase es un componente
    //por cada caso de uso se agrega eso
    public PlantaUseCase plantaUseCase(PlantaGateway plantaGateway, ArchivoGateway archivoGateway) {
        return new PlantaUseCase(plantaGateway, archivoGateway);
    }

    @Bean
    public NodoMapaUseCase nodoMapaUseCase(NodoMapaGateway nodoMapaGateway)  {
        return new NodoMapaUseCase(nodoMapaGateway);
    }
    @Bean
    public InsigniaUseCase insigniaUseCase(InsigniaGateway insigniaGateway) {
        return new InsigniaUseCase(insigniaGateway);
    }





}
