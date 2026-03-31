package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UnlockDataJpaRepository extends JpaRepository<UnlockData, Long> {

    Optional<UnlockData> findByUserEmailAndCodigoNodo(String userEmail, String codigoNodo);

    List<UnlockData> findByUserEmail(String userEmail);
}