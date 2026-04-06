package com.proyecto.progress.infraestructure.driver_adapter.jpa_repository.nodomapa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nodo_mapa")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NodoMapaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigoNodo;

    @Column(nullable = false)
    private String nombreNodo;

    @Column(nullable = false)
    private Double posicionX;

    @Column(nullable = false)
    private Double posicionY;

    @Column(nullable = false)
    private String videoUrl;

    @Column(nullable = false)
    private String nombreCientificoPlanta;
}