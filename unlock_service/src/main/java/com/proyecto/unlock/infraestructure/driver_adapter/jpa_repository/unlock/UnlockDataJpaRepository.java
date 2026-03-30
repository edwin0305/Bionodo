package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnlockDataJpaRepository extends JpaRepository<UnlockData, Long> {
    UnlockData findByUserIdAndCodigoNodo(Long userId, String codigoNodo);
    List<UnlockData> findByUserId(Long userId);
}
