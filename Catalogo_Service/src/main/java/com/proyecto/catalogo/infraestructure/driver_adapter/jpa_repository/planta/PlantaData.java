package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "planta")
@Data
public class PlantaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_cientifico", nullable = false)
    private String nombreCientifico;

    @Column(name = "nombre_comun", nullable = false, unique = true)
    private String nombreComun;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String morfologia;

    @Column(nullable = false)
    private String origen;

    @Column(name = "tipo_de_reproduccion", nullable = false)
    private String tipoDeReproduccion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String biodiversidad;

    @Column(name = "beneficios_ambientales", nullable = false, columnDefinition = "TEXT")
    private String beneficiosAmbientales;

    @Column(name = "recomendaciones_de_cuidado", nullable = false, columnDefinition = "TEXT")
    private String recomendacionesDeCuidado;

    @ElementCollection
    @CollectionTable(name = "planta_fotos", joinColumns = @JoinColumn(name = "planta_id"))
    @Column(name = "foto_url", nullable = false)
    private List<String> fotos;
}
