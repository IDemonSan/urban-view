-- ==============================================================================
-- ROLLBACK SCRIPT: U1__init_schema.sql
-- ==============================================================================
-- Revierte la migración base V1 eliminando la tabla elementos_plano
-- ==============================================================================

DROP TABLE IF EXISTS elementos_plano;
-- NOTA: No eliminamos la extensión postgis para evitar impactar otras tablas del servidor
