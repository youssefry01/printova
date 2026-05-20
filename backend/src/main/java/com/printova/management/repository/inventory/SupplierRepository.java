package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Optional<Supplier> findBySupplierId(Integer supplierId);
    Optional<Supplier> findBySupplierEmail(String supplierEmail);
    Optional<Supplier> findBySupplierPhone(String supplierPhone);
    Optional<Supplier> findBySupplierNameIgnoreCase(@NonNull String supplierName);
    Optional<Supplier> findBySupplierEmailIgnoreCase(@NonNull String supplierEmail);
}