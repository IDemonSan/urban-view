package com.urbanview.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElementoEstadoDTO {
    @NotBlank(message = "El estado no puede estar vacío.")
    @Pattern(regexp = "^(DISPONIBLE|VENDIDO)$", message = "El estado debe ser DISPONIBLE o VENDIDO.")
    private String estado;
}
