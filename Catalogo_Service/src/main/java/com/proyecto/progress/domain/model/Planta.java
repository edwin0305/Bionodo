package com.proyecto.progress.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

//SIEMPRE DEBEN IR ESTAS ETIQUETAS
@AllArgsConstructor //CREACION DEL CONSTRUCTOR
@NoArgsConstructor
@Setter //MODIFICA ATRIBUTO
@Getter //OBTENER ATRIBUTO

public class Planta {

        //Atributos
        private Long id;
        private String nombreCientifico;
        private String nombreComun;
        private String morfologia;
        private String origen;
        private String tipoDeReproduccion;
        private String biodiversidad;
        private String beneficiosAmbientales;
        private String recomendacionesDeCuidado;
        private List<String> fotos;

}


