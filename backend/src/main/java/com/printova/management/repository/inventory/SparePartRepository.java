package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import java.util.Optional;

public interface SparePartRepository extends JpaRepository<SparePart, Integer> {
    Optional<SparePart> findByPartId(Integer partId);
    Optional<SparePart> findByPartName(String partName);
    Optional<SparePart> findByPartNameIgnoreCase(@NonNull String partName);
}
