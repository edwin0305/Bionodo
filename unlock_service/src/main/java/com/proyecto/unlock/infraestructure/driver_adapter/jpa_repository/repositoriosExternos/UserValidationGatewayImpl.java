package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.repositoriosExternos;

import com.proyecto.unlock.domain.model.gateway.UserValidationGateway;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserValidationGatewayImpl implements UserValidationGateway {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean existeUsuarioPorCorreo(String userEmail) {
        try {
            String url = "http://localhost:8080/api/proyecto/usuario/buscar/" + userEmail;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            // ✔️ IMPORTANTE: validar body, no solo status
            return response.getStatusCode().is2xxSuccessful() && response.getBody() != null;

        } catch (Exception e) {
            return false;
        }
    }
}