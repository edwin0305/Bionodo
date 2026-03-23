package com.proyecto.progress.domain.model.gateway;


public interface CatalogoGateway {

    boolean existeNodoPorCodigo(String codigoNodo);

    boolean existeInsigniaPorCodigo(String codigoInsignia);
}