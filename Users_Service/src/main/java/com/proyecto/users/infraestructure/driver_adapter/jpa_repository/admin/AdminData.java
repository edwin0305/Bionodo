package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad JPA que representa un administrador en la base de datos.
 *
 * Se utiliza el correo electrónico como identificador único del administrador.
 */
@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminData {

    /**
     * Correo electrónico del administrador.
     * Se utiliza como clave primaria.
     */
    @Id
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * Contraseña encriptada del administrador.
     */
    @Column(nullable = false, length = 255)
    private String password;
}