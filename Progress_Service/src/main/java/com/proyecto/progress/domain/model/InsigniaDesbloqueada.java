package com.proyecto.progress.domain.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InsigniaDesbloqueada {
    private Long id;
    private String emailUsuario;
    private String codigoInsignia;
    private LocalDateTime fechaObtencion;
}