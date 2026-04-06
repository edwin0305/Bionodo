package com.proyecto.unlock.infraestructure.driver_adapter.jpa_repository.unlock;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "unlocks", uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_email", "codigo_nodo"})
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnlockData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "codigo_nodo", nullable = false)
    private String codigoNodo;
}