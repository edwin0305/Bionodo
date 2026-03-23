package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad JPA que representa un usuario en la base de datos.
 *
 * Se utiliza el correo electrónico como identificador único del usuario.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioData {

    /**
     * Correo electrónico del usuario.
     * Se utiliza como clave primaria.
     */
    @Id
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * Nombre del usuario (solo letras y espacios).
     */
    @Column(nullable = false, length = 100)
    private String nombre;

    /**
     * Apellido del usuario (solo letras y espacios).
     */
    @Column(nullable = false, length = 100)
    private String apellido;

    /**
     * Número de teléfono del usuario.
     */
    @Column(nullable = false, length = 20)
    private String telefono;

    /**
     * Contraseña encriptada del usuario.
     */
    @Column(nullable = false, length = 255)
    private String password;

    /**
     * Edad del usuario.
     */
    @Column(nullable = false)
    private Integer edad;
}