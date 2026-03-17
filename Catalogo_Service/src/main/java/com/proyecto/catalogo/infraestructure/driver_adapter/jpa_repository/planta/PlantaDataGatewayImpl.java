package com.proyecto.catalogo.infraestructure.driver_adapter.jpa_repository.planta;

import com.proyecto.catalogo.domain.model.Planta;
import com.proyecto.catalogo.domain.model.gateway.PlantaGateway;
import com.proyecto.catalogo.infraestructure.mapper.MapperPlanta;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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
    public Planta buscarPorNombreCientifico(String nombreCientifico) {
        return repository.findByNombreCientifico(nombreCientifico)
                .map(mapperPlanta::toPlanta)
                .orElse(null);
    }

    @Override
    public void eliminarPorNombreCientifico(String nombreCientifico) {
        PlantaData plantaData = repository.findByNombreCientifico(nombreCientifico)
                .orElseThrow(() -> new RuntimeException("Planta no encontrada para eliminar"));

        repository.deleteById(plantaData.getId());
    }
    @Override
    public List<Planta> listarPlantas() {
        return repository.findAll()
                .stream()
                .map(mapperPlanta::toPlanta)
                .toList();
    }
}