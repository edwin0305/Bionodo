ALTER TABLE IF EXISTS planta
    ALTER COLUMN nombre_cientifico TYPE TEXT,
    ALTER COLUMN nombre_comun TYPE TEXT,
    ALTER COLUMN morfologia TYPE TEXT,
    ALTER COLUMN origen TYPE TEXT,
    ALTER COLUMN tipo_de_reproduccion TYPE TEXT,
    ALTER COLUMN biodiversidad TYPE TEXT,
    ALTER COLUMN beneficios_ambientales TYPE TEXT,
    ALTER COLUMN recomendaciones_de_cuidado TYPE TEXT;

ALTER TABLE IF EXISTS planta_fotos
    ALTER COLUMN foto_url TYPE TEXT;
