package com.proyecto.users.domain.model.gateway;

import com.proyecto.users.domain.model.Admin;

import java.util.List;

public interface AdminGateway {

    Admin guardarAdmin(Admin admin);

    Admin buscarPorEmail(String email);
    void eliminarAdmin(String email);

    List<Admin> listarAdmins();
}
