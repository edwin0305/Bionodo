package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.repositoriosExternos;

import com.proyecto.unlock.domain.model.gateway.NodoValidationGateway;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NodoValidationGatewayImpl implements NodoValidationGateway {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean existeNodoPorCodigo(String codigoNodo) {
        try {
            String url = "http://localhost:8081/api/proyecto/nodomapa/buscar-codigo/" + codigoNodo;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception e) {
            return false;
        }
    }
}