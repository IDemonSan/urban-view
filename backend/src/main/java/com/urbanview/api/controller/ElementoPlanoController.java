package com.urbanview.api.controller;

import com.urbanview.api.dto.ElementoEstadoDTO;
import com.urbanview.api.model.ElementoPlano;
import com.urbanview.api.repository.ElementoPlanoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/plano")
public class ElementoPlanoController {

    private final ElementoPlanoRepository repository;

    @Autowired
    public ElementoPlanoController(ElementoPlanoRepository repository) {
        this.repository = repository;
    }

    /**
     * GET /api/plano
     * Recupera todos los elementos urbanos registrados en la base de datos (lotes, calles, parques).
     */
    @GetMapping
    public ResponseEntity<List<ElementoPlano>> obtenerTodos() {
        System.out.println("[API] Solicitud GET /api/plano recibida.");
        List<ElementoPlano> elementos = repository.findAll();
        return ResponseEntity.ok(elementos);
    }

    /**
     * PUT /api/plano/{id}/estado
     * Actualiza el estado comercial de un lote específico.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody ElementoEstadoDTO estadoDto) {
        
        System.out.println("[API] Solicitud PUT /api/plano/" + id + "/estado recibida con estado: " + estadoDto.getEstado());

        return repository.findById(id).map(elemento -> {
            // Regla de negocio: Solo los elementos del tipo LOTE pueden cambiar de estado comercial
            if (!"LOTE".equalsIgnoreCase(elemento.getTipoElemento())) {
                return ResponseEntity.badRequest()
                        .body("Error: Solo se puede modificar el estado comercial de elementos tipo LOTE.");
            }

            // Validar estados válidos
            String nuevoEstado = estadoDto.getEstado().toUpperCase();
            if (!"DISPONIBLE".equals(nuevoEstado) && !"VENDIDO".equals(nuevoEstado)) {
                return ResponseEntity.badRequest()
                        .body("Error: Estado no válido. Debe ser DISPONIBLE o VENDIDO.");
            }

            // Actualizar y guardar
            elemento.setEstado(nuevoEstado);
            ElementoPlano actualizado = repository.save(elemento);
            System.out.println("[SUCCESS] Lote " + elemento.getCodigo() + " actualizado exitosamente a: " + nuevoEstado);
            return ResponseEntity.ok(actualizado);

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
