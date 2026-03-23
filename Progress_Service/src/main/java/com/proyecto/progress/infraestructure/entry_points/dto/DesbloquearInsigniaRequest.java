package com.proyecto.progress.infraestructure.entry_points.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DesbloquearInsigniaRequest {

    private String emailUsuario;
    private String codigoInsignia;
}