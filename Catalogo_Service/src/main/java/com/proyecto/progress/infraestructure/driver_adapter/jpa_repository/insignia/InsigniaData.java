package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.insignia;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "insignia")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsigniaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_insignia", nullable = false, unique = true)
    private String codigoInsignia;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;


    @Column(name = "imagen_url")
    private String imagenUrl;
}
