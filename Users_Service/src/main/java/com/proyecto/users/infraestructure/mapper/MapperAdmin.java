package com.proyecto.users.infraestructure.mapper;

import com.proyecto.users.domain.model.Admin;
import com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin.AdminData;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de convertir entre el modelo de dominio Admin
 * y la entidad de persistencia AdminData.
 */
@Component
public class MapperAdmin {

    /**
     * Convierte AdminData (persistencia) a Admin (dominio).
     */
    public Admin toAdmin(AdminData adminData) {
        if (adminData == null) {
            return null;
        }

        return new Admin(
                adminData.getEmail(),
                adminData.getPassword()
        );
    }

    /**
     * Convierte Admin (dominio) a AdminData (persistencia).
     */
    public AdminData toAdminData(Admin admin) {
        if (admin == null) {
            return null;
        }

        return new AdminData(
                admin.getEmail(),
                admin.getPassword()
        );
    }
}
