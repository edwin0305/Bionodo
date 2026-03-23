package com.proyecto.progress.domain.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenProgreso {
    private String emailUsuario;
    private int totalNodos;
    private int nodosDesbloqueados;
    private double porcentajeProgreso;
    private int insigniasDesbloqueadas;
}