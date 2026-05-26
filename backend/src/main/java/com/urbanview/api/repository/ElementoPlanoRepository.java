package com.urbanview.api.repository;

import com.urbanview.api.model.ElementoPlano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ElementoPlanoRepository extends JpaRepository<ElementoPlano, UUID> {
}
