package com.proyecto.catalogo.domain.model.gateway;

import com.proyecto.catalogo.domain.model.Planta;

import java.util.List;

public interface PlantaGateway {
    Planta guardarPlanta(Planta planta);
    Planta actualizarPlanta(Planta planta);
    Planta buscarPorNombre_Cientifico(String Nombre_Cientifico);
    void eliminarPorNombre(String Nombre);
    List<Planta> listarPlanta();

}
