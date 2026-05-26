# 🎯 CONTEXTO DEL PROYECTO

**Repositorio**: `https://github.com/IDemonSan/urban-view`  
**Rama activa**: `modernize/java-20260525224610`  
**Objetivo**: Mejorar seguridad, rendimiento, accesibilidad y UX sin romper el desarrollo actual.

**Stack Tecnológico**:
- Frontend: React 18 + Vite + TailwindCSS + TypeScript
- Backend: Spring Boot 3 + Java 21 + Spring Security
- Database: PostgreSQL 15 + PostGIS 3.3
- Infra: Docker Compose + Nginx Proxy + GitHub Actions

---

# ⚠️ RESTRICCIONES GLOBALES (NO NEGOCIABLES)

```yaml
zero_breaking_rules:
  - "Ningún cambio debe romper la funcionalidad existente en producción"
  - "Todas las nuevas features deben ir detrás de feature flags con default: OFF"
  - "Migraciones de DB deben usar CONCURRENTLY o patrones online-safe"
  - "Tests deben pasar antes de merge: lint → unit → integration → e2e"
  - "Documentar cada cambio en README o ADR (Architecture Decision Record)"

feature_flag_strategy:
  provider: "simple-config"  # Implementar con src/config/features.js
  environments:
    development: "flags activables por query param ?flags=xyz"
    staging: "flags controlados por variable de entorno"
    production: "flags solo via configuración remota (futuro)"
  
rollback_protocol:
  frontend: "Revertir commit + limpiar localStorage de flags"
  backend: "Perfil Spring 'legacy' para fallback inmediato"
  database: "Script rollback_V*.sql por cada migración Flyway"