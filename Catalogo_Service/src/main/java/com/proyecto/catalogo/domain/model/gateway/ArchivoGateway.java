package com.proyecto.catalogo.domain.model.gateway;

public interface ArchivoGateway {
    String guardarArchivo(byte[] contenido, String nombreOriginal);
    void eliminarArchivo(String rutaArchivo);
}