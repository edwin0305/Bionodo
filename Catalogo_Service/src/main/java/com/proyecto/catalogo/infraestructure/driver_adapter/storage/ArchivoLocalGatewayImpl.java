package com.proyecto.catalogo.infraestructure.driver_adapter.storage;

import com.proyecto.catalogo.domain.model.gateway.ArchivoGateway;
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
    public String guardarArchivo(byte[] contenido, String nombreOriginal) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String nombreLimpio = nombreOriginal.replaceAll("\\s+", "_");
            String nombreFinal = UUID.randomUUID() + "_" + nombreLimpio;
            Path rutaArchivo = root.resolve(nombreFinal);

            Files.write(rutaArchivo, contenido);

            return "/uploads/" + nombreFinal;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public void eliminarArchivo(String rutaArchivo) {
        try {
            String nombreArchivo = rutaArchivo.replace("/uploads/", "");
            Path archivo = root.resolve(nombreArchivo);
            Files.deleteIfExists(archivo);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar el archivo", e);
        }
    }
}