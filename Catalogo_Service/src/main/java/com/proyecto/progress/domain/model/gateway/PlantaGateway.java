package com.proyecto.progress.domain.model.gateway;

import com.proyecto.progress.domain.model.Planta;
import java.util.List;

public interface PlantaGateway {

    Planta guardarPlanta(Planta planta);

    Planta actualizarPlanta(Planta planta);

    Planta buscarPorNombreCientifico(String nombreCientifico);

    void eliminarPorNombreCientifico(String nombreCientifico);

    List<Planta> listarPlantas();
}