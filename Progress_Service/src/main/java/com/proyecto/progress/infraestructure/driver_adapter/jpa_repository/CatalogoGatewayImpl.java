package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository;


import com.proyecto.progress.domain.model.gateway.CatalogoGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
@RequiredArgsConstructor
public class CatalogoGatewayImpl implements CatalogoGateway {

    private final RestTemplate restTemplate;

    @Value("${services.catalogo.url}")
    private String catalogoBaseUrl;

    @Override
    public boolean existeNodoPorCodigo(String codigoNodo) {
        try {
            String url = catalogoBaseUrl + "/api/proyecto/nodomapa/buscar-codigo/" + codigoNodo;
            Object response = restTemplate.getForObject(url, Object.class);
            return response != null;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean existeInsigniaPorCodigo(String codigoInsignia) {
        try {
            String url = catalogoBaseUrl + "/api/proyecto/insignia/buscar-codigo/" + codigoInsignia;
            Object response = restTemplate.getForObject(url, Object.class);
            return response != null;
        } catch (Exception e) {
            return false;
        }
    }
}