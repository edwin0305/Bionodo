package com.proyecto.catalogo.domain.model.gateway;

public interface ArchivoGateway {

    String guardarArchivo(byte[] contenido, String nombreOriginal, String carpeta);

    void eliminarArchivo(String rutaArchivo);
}