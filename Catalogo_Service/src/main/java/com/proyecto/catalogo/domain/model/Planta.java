package com.proyecto.catalogo.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
//SIEMPRE DEBEN IR ESTAS ETIQUETAS
@AllArgsConstructor //CREACION DEL CONSTRUCTOR
@NoArgsConstructor
@Setter //MODIFICA ATRIBUTO
@Getter //OBTENER ATRIBUTO

public class Planta {
        //Atributos
        private String nombre_cientifico;
        private String nombre_comun;
        private String morfologia;
        private String origen;
        private String tipo_de_reproduccion;
        private String biodiversidad;
        private String beneficios_ambientales;
        private String recomendaciones_de_cuidado;



    }


