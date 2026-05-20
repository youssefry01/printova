package com.printova.management.service.inventory.supplier;

import com.printova.management.dto.inventory.supplier.AddSupplierRequest;
import com.printova.management.dto.inventory.supplier.SupplierDTO;
import com.printova.management.dto.inventory.supplier.SupplierDTOMapper;
import com.printova.management.dto.inventory.supplier.UpdateSupplierRequest;
import com.printova.management.model.inventory.Supplier;
import com.printova.management.repository.inventory.SupplierRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierDTOMapper supplierDTOMapper;

    public SupplierServiceImpl(SupplierRepository supplierRepository, SupplierDTOMapper supplierDTOMapper) {
        this.supplierRepository = supplierRepository;
        this.supplierDTOMapper = supplierDTOMapper;
    }

    @Override
    public ResponseEntity<?> addSupplier(AddSupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .supplierName(request.getSupplierName())
                .supplierEmail(request.getSupplierEmail())
                .supplierPhone(request.getSupplierPhone())
                .build();
        if (supplier != null) {
            supplierRepository.save(supplier);
            return ResponseEntity.ok(supplierDTOMapper.apply(supplier));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to create supplier"));
    }

    @Override
    public ResponseEntity<?> deleteSupplier(Integer supplierId) {
        if (supplierId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Supplier ID cannot be null"));
        }
        
        Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
        if (supplier != null) {
            supplierRepository.delete(supplier);
            return ResponseEntity.ok(Map.of("message", "Supplier deleted successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to delete supplier"));
    }

    @Override
    public ResponseEntity<?> updateSupplier(Integer supplierId, UpdateSupplierRequest request) {
        if (supplierId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Supplier ID cannot be null"));
        }
        
        Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
        if (supplier == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Supplier not found"));
        }
        if (request.getSupplierName() != null && !request.getSupplierName().isEmpty()) {
            supplier.setSupplierName(request.getSupplierName());
        }
        if (request.getSupplierEmail() != null && !request.getSupplierEmail().isEmpty()) {
            supplier.setSupplierEmail(request.getSupplierEmail());
        }
        if (request.getSupplierPhone() != null && !request.getSupplierPhone().isEmpty()) {
            supplier.setSupplierPhone(request.getSupplierPhone());
        }

        supplierRepository.save(supplier);
        return ResponseEntity.ok(supplierDTOMapper.apply(supplier));
    }

    @Override
    public ResponseEntity<?> getAllSuppliers() {
        List<SupplierDTO> suppliers = supplierRepository.findAll().stream()
                .map(supplierDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suppliers);
    }

    @Override
    public ResponseEntity<?> getSupplierById(Integer supplierId) {
        if (supplierId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Supplier ID cannot be null"));
        }
        
        Supplier supplier = supplierRepository.findById(supplierId).orElse(null);
        if (supplier == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Supplier not found"));
        }
        return ResponseEntity.ok(supplierDTOMapper.apply(supplier));
    }
}