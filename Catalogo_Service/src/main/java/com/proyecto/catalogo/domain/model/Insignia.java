package com.proyecto.catalogo.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Insignia {
    private Long id;
    private String codigoInsignia;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
}
