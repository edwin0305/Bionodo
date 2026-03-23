package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.NodoDesbloqueado;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "nodo_desbloqueado",
        uniqueConstraints = @UniqueConstraint(columnNames = {"email_usuario", "codigo_nodo"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NodoDesbloqueadoData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_usuario", nullable = false)
    private String emailUsuario;

    @Column(name = "codigo_nodo", nullable = false)
    private String codigoNodo;

    @Column(name = "fecha_desbloqueo", nullable = false)
    private LocalDateTime fechaDesbloqueo;
}