package com.proyecto.progress.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NodoMapa {

    private Long id;
    private String codigoNodo;
    private String nombreNodo;
    private Double posicionX;
    private Double posicionY;
    private String videoUrl;
    private String nombreCientificoPlanta;
}