package com.proyecto.users.infraestructure.driver_adapter.jpa_repository.usuario;

import com.proyecto.users.domain.model.Usuario;
import com.proyecto.users.domain.model.gateway.UsuarioGateway;
import com.proyecto.users.infraestructure.mapper.MapperUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Implementación del gateway de usuario.
 *
 * Esta clase conecta la lógica de dominio con la persistencia en base de datos
 * mediante JPA y realiza la conversión entre el modelo de dominio y la entidad.
 */
@Repository
@RequiredArgsConstructor
public class UsuarioDataGatewayImpl implements UsuarioGateway {

    private final MapperUsuario mapperUsuario;
    private final UsuarioDataJpaRepository repository;

    /**
     * Guarda un nuevo usuario en la base de datos.
     *
     * @param usuario usuario a guardar
     * @return usuario guardado
     */
    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        UsuarioData usuarioData = mapperUsuario.toUsuarioData(usuario);
        return mapperUsuario.toUsuario(repository.save(usuarioData));
    }

    /**
     * Actualiza la información de un usuario en la base de datos.
     *
     * @param usuario usuario con los datos actualizados
     * @return usuario actualizado
     */
    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        UsuarioData usuarioData = mapperUsuario.toUsuarioData(usuario);
        return mapperUsuario.toUsuario(repository.save(usuarioData));
    }

    /**
     * Busca un usuario por su correo electrónico.
     *
     * @param email correo del usuario
     * @return usuario encontrado o null si no existe
     */
    @Override
    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .map(mapperUsuario::toUsuario)
                .orElse(null);
    }

    /**
     * Elimina un usuario de la base de datos a partir de su correo electrónico.
     *
     * @param email correo del usuario a eliminar
     */
    @Override
    public void eliminarUsuario(String email) {
        repository.deleteById(email);
    }

    /**
     * Lista todos los usuarios registrados en la base de datos.
     *
     * @return lista de usuarios
     */
    @Override
    public List<Usuario> listarUsuarios() {
        return repository.findAll()
                .stream()
                .map(mapperUsuario::toUsuario)
                .toList();
    }
}
