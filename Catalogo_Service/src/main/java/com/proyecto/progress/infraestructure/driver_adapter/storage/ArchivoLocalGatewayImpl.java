package com.proyecto.progress.infraestructure.driver_adapter.storage;

import com.proyecto.progress.domain.model.gateway.ArchivoGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class ArchivoLocalGatewayImpl implements ArchivoGateway {

    private final Path root;

    public ArchivoLocalGatewayImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.root = Paths.get(uploadDir);
    }

    @Override
    public String guardarArchivo(byte[] contenido, String nombreOriginal, String carpeta) {
        try {
            Path carpetaDestino = root.resolve(carpeta);

            if (!Files.exists(carpetaDestino)) {
                Files.createDirectories(carpetaDestino);
            }

            String nombreLimpio = nombreOriginal.replaceAll("\\s+", "_");
            String nombreFinal = UUID.randomUUID() + "_" + nombreLimpio;
            Path rutaArchivo = carpetaDestino.resolve(nombreFinal);

            Files.write(rutaArchivo, contenido);

            return "/uploads/" + carpeta + "/" + nombreFinal;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public void eliminarArchivo(String rutaArchivo) {
        try {
            String rutaRelativa = rutaArchivo.replace("/uploads/", "");
            Path archivo = root.resolve(rutaRelativa);
            Files.deleteIfExists(archivo);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar el archivo", e);
        }
    }
}