package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta;

import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import com.proyecto.catalogo.infraestructure.mapper.MapperPlanta;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PlantaDataGatewayImpl implements PlantaGateway {

    private final MapperPlanta mapperPlanta;
    private final PlantaDataJpaRepository repository;
    @Override
    public Planta guardarPlanta(Planta planta) {
        PlantaData plantaData = mapperPlanta.toData(planta);
        return mapperPlanta.toPlanta(repository.save(plantaData));
    }

    @Override
    public Planta actualizarPlanta(Planta planta) {
        PlantaData plantaData = mapperPlanta.toData(planta);
        return mapperPlanta.toPlanta(repository.save(plantaData));
    }

    @Override
    public Planta buscarPorNombre_Cientifico(String Nombre_Cientifico) {
        return repository.findByNombreCientifico(Nombre_Cientifico).
                map(mapperPlanta::toPlanta)
                .orElse(null);
    }

    @Override
    public void eliminarPorNombre_Cientifico(String Nombre_Cientifico) {
        repository.deleteById(Nombre_Cientifico);

    }

    @Override
    public List<Planta> listarPlantas() {
        return repository.findAll().
                stream().
                map(mapperPlanta::toPlanta).
                toList();
    }
}
