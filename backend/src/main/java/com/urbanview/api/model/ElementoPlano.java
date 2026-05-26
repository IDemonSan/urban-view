package com.urbanview.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "elementos_plano")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElementoPlano {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "tipo_elemento", nullable = false)
    private String tipoElemento;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String estado;

    @Column(name = "svg_path", nullable = false, columnDefinition = "TEXT")
    private String svgPath;

    // La columna geoespacial 'geom' de PostGIS no se mapea en esta etapa del MVP
    // para mantener el contenedor Java desacoplado y ultra-ligero. La base de datos
    // conserva la geometría pura lista para futuras consultas espaciales complejas.
}
