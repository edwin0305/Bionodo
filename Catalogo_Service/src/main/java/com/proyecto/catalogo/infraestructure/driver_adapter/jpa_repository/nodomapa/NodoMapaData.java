
package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.nodomapa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nodo_mapa")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NodoMapaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_nodo", nullable = false, unique = true)
    private String codigoNodo;

    @Column(name = "nombre_nodo", nullable = false)
    private String nombreNodo;

    @Column(name = "posicion_x", nullable = false)
    private Double posicionX;

    @Column(name = "posicion_y", nullable = false)
    private Double posicionY;

    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;
}