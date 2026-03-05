package com.proyecto.users.infraestructure.entry_points;
import com.proyecto.users.domain.model.Admin;
import com.proyecto.users.domain.model.Usuario;
import com.proyecto.users.domain.usecase.AdminUseCase;
import com.proyecto.users.domain.usecase.UsuarioUseCase;
import com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin.AdminData;
import com.proyecto.users.infraestructure.mapper.MapperAdmin;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //indica que esta clase es un controlador, y se van a crear APIs que se van a exponer
@RequestMapping("/api/proyecto/admin") //parametrizar URLs
@RequiredArgsConstructor
public class AdminController {

    private final AdminUseCase adminUseCase;
    private final UsuarioUseCase usuarioUseCase;
    private final MapperAdmin mapperAdmin;

    @PostMapping("/save")
    public ResponseEntity<String> saveAdmin(@RequestBody AdminData adminData) {
        Admin admin = mapperAdmin.toAdmin(adminData);
        String resultado = adminUseCase.guadarAdmin(admin);

        if (resultado.startsWith("Admin guardado")) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }
        if (resultado.contains("Ya existe un admin" )) {
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        }
        return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("buscar/{email}")
    public ResponseEntity<Admin> buscarAdminPorEmail(@PathVariable String email) {
        try {
            Admin adminEncontrado = adminUseCase.buscarAdmin(email);

            if (adminEncontrado == null) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            return ResponseEntity.ok(adminEncontrado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @DeleteMapping("/eliminar/{email}")
    //que pase el obj por la URL, y no por un body
    public ResponseEntity<String>eliminarAdmin(@PathVariable String email) {
        try {
            Admin admin = adminUseCase.buscarAdmin(email);
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body("El admin con el email:" + email + " no exite en la BD");
            }
            adminUseCase.eliminarAdmin(email);
            //siempre se debe retornar un HTTP status
            return ResponseEntity.ok().body("Admin eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioUseCase.listarUsuarios();
    }



}
