package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.InsigniaDesbloqueada;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "insignia_desbloqueada",
        uniqueConstraints = @UniqueConstraint(columnNames = {"email_usuario", "codigo_insignia"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InsigniaDesbloqueadaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_usuario", nullable = false)
    private String emailUsuario;

    @Column(name = "codigo_insignia", nullable = false)
    private String codigoInsignia;

    @Column(name = "fecha_obtencion", nullable = false)
    private LocalDateTime fechaObtencion;
}