package com.proyecto.progress.application.config;

import com.proyecto.progress.domain.model.Insignia;
import com.proyecto.progress.domain.model.gateway.InsigniaGateway;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class InsigniaMilestoneSeedConfig {

    @Bean
    public CommandLineRunner insigniaMilestoneSeeder(InsigniaGateway insigniaGateway) {
        return args -> {
            for (MilestoneBadgeSeed seed : MILESTONE_BADGES) {
                if (insigniaGateway.buscarPorCodigoInsignia(seed.code()) != null) {
                    continue;
                }

                Insignia insignia = new Insignia();
                insignia.setCodigoInsignia(seed.code());
                insignia.setNombre(seed.name());
                insignia.setDescripcion(seed.description());
                insignia.setImagenUrl(seed.imageUrl());

                insigniaGateway.guardarInsignia(insignia);
            }
        };
    }

    private static final List<MilestoneBadgeSeed> MILESTONE_BADGES = List.of(
            new MilestoneBadgeSeed(
                    "INSIGNIA_5_NODOS",
                    "Semilla de Inicio",
                    "Has desbloqueado tus primeros 5 nodos y comenzaste a trazar tu ruta por el campus vivo.",
                    "/uploads/insignias/insignia-N1.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_10_NODOS",
                    "Raices del Recorrido",
                    "Ya conoces 10 nodos y tus pasos empiezan a conectar las historias botanicas del campus.",
                    "/uploads/insignias/insignia-N2.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_15_NODOS",
                    "Brote Explorador",
                    "Con 15 nodos desbloqueados, tu recorrido crece y tu mirada sobre la biodiversidad se hace mas amplia.",
                    "/uploads/insignias/insignia-N3.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_20_NODOS",
                    "Guardian del Sendero",
                    "Llegaste a 20 nodos y ya reconoces gran parte del trayecto vivo del campus.",
                    "/uploads/insignias/insignia-N4.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_25_NODOS",
                    "Cartografo Verde",
                    "Has registrado 25 nodos y tu mapa personal de especies toma forma.",
                    "/uploads/insignias/insignia-N5.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_30_NODOS",
                    "Cronista Botanico",
                    "Con 30 nodos desbloqueados, ya reunes una memoria rica del recorrido botanico.",
                    "/uploads/insignias/insignia-N6.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_35_NODOS",
                    "Custodio de la Biodiversidad",
                    "Has alcanzado 35 nodos y te conviertes en referente del cuidado y observacion del campus.",
                    "/uploads/insignias/insignia-N7.png"
            ),
            new MilestoneBadgeSeed(
                    "INSIGNIA_40_NODOS",
                    "Maestro del Campus Vivo",
                    "Completaste los 40 nodos y dominaste la experiencia completa de BIONODO.",
                    "/uploads/insignias/insignia-N8.png"
            )
    );

    private static final class MilestoneBadgeSeed {
        private final String code;
        private final String name;
        private final String description;
        private final String imageUrl;

        private MilestoneBadgeSeed(String code, String name, String description, String imageUrl) {
            this.code = code;
            this.name = name;
            this.description = description;
            this.imageUrl = imageUrl;
        }

        private String code() {
            return code;
        }

        private String name() {
            return name;
        }

        private String description() {
            return description;
        }

        private String imageUrl() {
            return imageUrl;
        }
    }
}
