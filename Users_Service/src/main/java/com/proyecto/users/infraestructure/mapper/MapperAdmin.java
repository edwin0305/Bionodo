package com.proyecto.users.infraestructure.mapper;

import com.proyecto.users.domain.model.Admin;
import com.proyecto.users.infraestructure.driver_adapter.jpa_repository.admin.AdminData;
import org.springframework.stereotype.Component;

@Component
public class MapperAdmin {
    public Admin toAdmin(AdminData adminData){
        if (adminData == null) return null;
        return new Admin(
                adminData.getEmail(),
                adminData.getPassword()
        );
    }

    public AdminData toAdminData(Admin admin){
        if (admin == null) return null;
        return new AdminData(
                admin.getEmail(),
                admin.getPassword()
        );
    }
}

