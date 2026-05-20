package com.printova.management.service.inventory.supplier;

import com.printova.management.dto.inventory.supplier.AddSupplierRequest;
import com.printova.management.dto.inventory.supplier.UpdateSupplierRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

public interface SupplierService {
    ResponseEntity<?> addSupplier(AddSupplierRequest request);
    ResponseEntity<?> deleteSupplier(@NonNull Integer supplierId);
    ResponseEntity<?> updateSupplier(@NonNull Integer supplierId, UpdateSupplierRequest request);
    ResponseEntity<?> getAllSuppliers();
    ResponseEntity<?> getSupplierById(@NonNull Integer supplierId);
}