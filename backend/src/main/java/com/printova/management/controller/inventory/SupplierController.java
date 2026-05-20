package com.printova.management.controller.inventory;

import com.printova.management.dto.inventory.supplier.AddSupplierRequest;
import com.printova.management.dto.inventory.supplier.UpdateSupplierRequest;
import com.printova.management.service.inventory.supplier.SupplierService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> addSupplier(@RequestBody AddSupplierRequest request) {
        return supplierService.addSupplier(request);
    }

    @GetMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getSupplierById(@PathVariable int supplierId) {
        return supplierService.getSupplierById(supplierId);
    }
    
    @PutMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> updateSupplier(@PathVariable int supplierId, @RequestBody UpdateSupplierRequest request) {
        return supplierService.updateSupplier(supplierId, request);
    }

    @DeleteMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> deleteSupplier(@PathVariable int supplierId) {
        return supplierService.deleteSupplier(supplierId);
    }
}