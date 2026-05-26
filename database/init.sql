-- Habilitar la extensión PostGIS para soporte geoespacial
CREATE EXTENSION IF NOT EXISTS postgis;

-- Eliminar tabla si existe (útil para pruebas de destrucción y recreación)
DROP TABLE IF EXISTS elementos_plano;

-- Crear tabla elementos_plano para almacenar lotes, calles e infraestructura
CREATE TABLE elementos_plano (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_elemento VARCHAR(50) NOT NULL CHECK (tipo_elemento IN ('LOTE', 'CALLE', 'PARQUE')),
    codigo VARCHAR(100) NOT NULL UNIQUE,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('DISPONIBLE', 'VENDIDO', 'PUBLICO')),
    geom GEOMETRY(Geometry, 4326),
    svg_path TEXT NOT NULL
);

-- Crear índice espacial sobre la columna de geometría para consultas geoespaciales veloces a futuro
CREATE INDEX IF NOT EXISTS elementos_plano_geom_idx ON elementos_plano USING GIST (geom);

-- Insertar datos semilla (5 lotes, 2 calles y 1 parque central)
-- Lotes (Tipo: LOTE, Estados: DISPONIBLE o VENDIDO)
INSERT INTO elementos_plano (tipo_elemento, codigo, estado, geom, svg_path) VALUES
('LOTE', 'Mz A - Lote 1', 'DISPONIBLE', 
 ST_GeomFromText('POLYGON((-77.0225 -12.0418, -77.0205 -12.0418, -77.0205 -12.0435, -77.0225 -12.0435, -77.0225 -12.0418))', 4326),
 'M 750,110 L 950,110 L 950,210 L 750,210 Z'),

('LOTE', 'Mz A - Lote 2', 'VENDIDO', 
 ST_GeomFromText('POLYGON((-77.0225 -12.0438, -77.0205 -12.0438, -77.0205 -12.0455, -77.0225 -12.0455, -77.0225 -12.0438))', 4326),
 'M 750,230 L 950,230 L 950,330 L 750,330 Z'),

('LOTE', 'Mz A - Lote 3', 'DISPONIBLE', 
 ST_GeomFromText('POLYGON((-77.0225 -12.0458, -77.0205 -12.0458, -77.0205 -12.0475, -77.0225 -12.0475, -77.0225 -12.0458))', 4326),
 'M 750,350 L 950,350 L 950,450 L 750,450 Z'),

('LOTE', 'Mz B - Lote 1', 'DISPONIBLE', 
 ST_GeomFromText('POLYGON((-77.0270 -12.0468, -77.0252 -12.0468, -77.0252 -12.0485, -77.0270 -12.0485, -77.0270 -12.0468))', 4326),
 'M 300,410 L 480,410 L 480,510 L 300,510 Z'),

('LOTE', 'Mz B - Lote 2', 'VENDIDO', 
 ST_GeomFromText('POLYGON((-77.0248 -12.0468, -77.0230 -12.0468, -77.0230 -12.0485, -77.0248 -12.0485, -77.0248 -12.0468))', 4326),
 'M 520,410 L 700,410 L 700,510 L 520,510 Z');

-- Calles (Tipo: CALLE, Estado: PUBLICO)
INSERT INTO elementos_plano (tipo_elemento, codigo, estado, geom, svg_path) VALUES
('CALLE', 'Avenida Principal', 'PUBLICO', 
 ST_GeomFromText('POLYGON((-77.0295 -12.0408, -77.0205 -12.0408, -77.0205 -12.0415, -77.0295 -12.0415, -77.0295 -12.0408))', 4326),
 'M 50,50 L 950,50 L 950,90 L 50,90 Z'),

('CALLE', 'Calle Secundaria', 'PUBLICO', 
 ST_GeomFromText('POLYGON((-77.0290 -12.0415, -77.0286 -12.0415, -77.0286 -12.0492, -77.0290 -12.0492, -77.0290 -12.0415))', 4326),
 'M 100,90 L 140,90 L 140,550 L 100,550 Z');

-- Parque Central (Tipo: PARQUE, Estado: PUBLICO)
INSERT INTO elementos_plano (tipo_elemento, codigo, estado, geom, svg_path) VALUES
('PARQUE', 'Parque Central', 'PUBLICO', 
 ST_GeomFromText('POLYGON((-77.0270 -12.0430, -77.0230 -12.0430, -77.0230 -12.0463, -77.0270 -12.0463, -77.0270 -12.0430))', 4326),
 'M 300,180 L 700,180 L 700,380 L 300,380 Z');
