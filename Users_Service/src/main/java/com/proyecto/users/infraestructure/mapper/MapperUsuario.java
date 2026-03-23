package com.proyecto.users.infraestructure.mapper;

import com.proyecto.users.domain.model.Usuario;
import com.proyecto.users.infraestructure.driver_adapter.jpa_repository.usuario.UsuarioData;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de convertir entre el modelo de dominio Usuario
 * y la entidad de persistencia UsuarioData.
 */
@Component
public class MapperUsuario {

    /**
     * Convierte UsuarioData (persistencia) a Usuario (dominio).
     */
    public Usuario toUsuario(UsuarioData usuarioData) {
        if (usuarioData == null) {
            return null;
        }

        return new Usuario(
                usuarioData.getEmail(),
                usuarioData.getNombre(),
                usuarioData.getApellido(),
                usuarioData.getTelefono(),
                usuarioData.getPassword(),
                usuarioData.getEdad()
        );
    }

    /**
     * Convierte Usuario (dominio) a UsuarioData (persistencia).
     */
    public UsuarioData toUsuarioData(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new UsuarioData(
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getTelefono(),
                usuario.getPassword(),
                usuario.getEdad()
        );
    }
}