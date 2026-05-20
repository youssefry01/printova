package com.printova.management.service.inventory.sparePart;

import com.printova.management.model.inventory.SparePart;
import com.printova.management.model.inventory.Stock;
import com.printova.management.model.inventory.Category;
import com.printova.management.model.inventory.Supplier;
import com.printova.management.model.inventory.PartPrice;
import com.printova.management.dto.inventory.sparePart.AddSparePartRequest;
import com.printova.management.dto.inventory.sparePart.SparePartDTO;
import com.printova.management.dto.inventory.sparePart.SparePartDTOMapper;
import com.printova.management.dto.inventory.sparePart.UpdateSparePartRequest;
import com.printova.management.repository.inventory.SparePartRepository;
import com.printova.management.repository.inventory.CategoryRepository;
import com.printova.management.repository.inventory.SupplierRepository;
import com.printova.management.repository.inventory.PartPriceRepository;
import com.printova.management.repository.inventory.StockRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SparePartServiceImpl implements SparePartService {
    private final SparePartRepository sparePartRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final PartPriceRepository partPriceRepository;
    private final StockRepository stockRepository;
    private final SparePartDTOMapper sparePartDTOMapper;

    public SparePartServiceImpl(SparePartRepository sparePartRepository, CategoryRepository categoryRepository, SupplierRepository supplierRepository, PartPriceRepository partPriceRepository, StockRepository stockRepository, SparePartDTOMapper sparePartDTOMapper) {
        this.sparePartRepository = sparePartRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.partPriceRepository = partPriceRepository;
        this.stockRepository = stockRepository;
        this.sparePartDTOMapper = sparePartDTOMapper;
    }

    @Override
    public ResponseEntity<?> addSparePart(AddSparePartRequest request) {

        // 1️⃣ Validate request object
        if (request == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Request body cannot be null"));
        }

        // 2️⃣ Validate required fields
        if (request.getPartName() == null || request.getPartName().isBlank()) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Part name is required"));
        }

        if (request.getCategoryId() == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Category ID is required"));
        }

        if (request.getSupplierId() == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Supplier ID is required"));
        }
        
        if (request.getInitialPrice() == null ||
                request.getInitialPrice().compareTo(BigDecimal.ZERO) <= 0) {

            return ResponseEntity.status(400)
                    .body(Map.of("error", "Initial price must be greater than 0"));
        }

        // 4️⃣ Validate Category exists
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        if (category == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Category not found"));
        }

        // 5️⃣ Validate Supplier exists
        Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
        if (supplier == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Supplier not found"));
        }

        SparePart part = SparePart.builder()
                .partName(request.getPartName())
                .partDescription(request.getPartDescription())
                .category(category)
                .supplier(supplier)
                .build();

        sparePartRepository.save(part);

        PartPrice price = PartPrice.builder()
                .part(part)
                .price(request.getInitialPrice())
                .validFrom(LocalDateTime.now())
                .build();

        partPriceRepository.save(price);

        Stock stock = Stock.builder()
                .part(part)
                .stockQuantity(0)
                .build();

        stockRepository.save(stock);

        return ResponseEntity.ok(sparePartDTOMapper.apply(part));
    }

    @Override
    public ResponseEntity<?> deleteSparePart(Integer partId) {
        if (partId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Spare part ID cannot be null"));
        }

        SparePart sparePart = sparePartRepository.findById(partId).orElse(null);
        if (sparePart == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Spare part not found"));
        }

        sparePartRepository.delete(sparePart);
        return ResponseEntity.ok(Map.of("message", "Spare part deleted successfully"));
    }

    @Override
    public ResponseEntity<?> updateSparePart(Integer partId, UpdateSparePartRequest request) {
        if (partId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Spare part ID cannot be null"));
        }
        
        SparePart sparePart = sparePartRepository.findById(partId).orElse(null);
        if (sparePart == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Spare part not found"));
        }
        if (request.getPartName() != null && !request.getPartName().isEmpty()) {
            sparePart.setPartName(request.getPartName());
        }
        if (request.getPartDescription() != null && !request.getPartDescription().isEmpty()) {
            sparePart.setPartDescription(request.getPartDescription());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            sparePart.setCategory(category);
        }
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            sparePart.setSupplier(supplier);
        }

        sparePartRepository.save(sparePart);

        return ResponseEntity.ok(sparePartDTOMapper.apply(sparePart));
    }

    @Override
    public ResponseEntity<?> getAllSpareParts() {
        List<SparePartDTO> parts = sparePartRepository.findAll()
                .stream()
                .map(sparePartDTOMapper)
                .collect(Collectors.toList());

        return ResponseEntity.ok(parts);
    }

    @Override
    public ResponseEntity<?> getSparePartById(Integer partId) {
        if (partId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Spare part ID cannot be null"));
        }
        
        SparePart sparePart = sparePartRepository.findById(partId).orElse(null);
        if (sparePart == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Spare part not found"));
        }
        return ResponseEntity.ok(sparePartDTOMapper.apply(sparePart));
    }
}