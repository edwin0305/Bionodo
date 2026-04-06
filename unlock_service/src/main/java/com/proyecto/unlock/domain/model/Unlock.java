package com.proyecto.unlock.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Unlock {

    private Long id;
    private String userEmail;
    private String codigoNodo;
}