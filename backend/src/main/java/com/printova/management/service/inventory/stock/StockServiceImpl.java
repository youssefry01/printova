package com.printova.management.service.inventory.stock;

import com.printova.management.dto.inventory.stock.StockDTO;
import com.printova.management.dto.inventory.stock.AdjustStockRequest;
import com.printova.management.dto.inventory.stock.UpdateStockRequest;
import com.printova.management.model.inventory.SparePart;
import com.printova.management.model.inventory.Stock;
import com.printova.management.repository.inventory.StockRepository;
import com.printova.management.repository.inventory.SparePartRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final SparePartRepository sparePartRepository;

    public StockServiceImpl(StockRepository stockRepository, SparePartRepository sparePartRepository) {
        this.stockRepository = stockRepository;
        this.sparePartRepository = sparePartRepository;
    }

    @Override
    public ResponseEntity<?> getAllStocks() {
        List<StockDTO> stocks = stockRepository.findAll().stream()
                .map(stock -> new StockDTO(
                        stock.getStockId(),
                        stock.getPart().getPartId(),
                        stock.getPart().getPartName(),
                        stock.getStockQuantity()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(stocks);
    }

    @Override
    public ResponseEntity<?> getStockByPartId(Integer partId) {
        if (partId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Part ID cannot be null"));
        }

        Stock stock = stockRepository.findByPartPartId(partId).orElse(null);
        if (stock == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Stock not found for this part"));
        }

        StockDTO dto = new StockDTO(
                stock.getStockId(),
                stock.getPart().getPartId(),
                stock.getPart().getPartName(),
                stock.getStockQuantity()
        );

        return ResponseEntity.ok(dto);
    }

    @Override
    public ResponseEntity<?> updateStock(Integer partId, UpdateStockRequest request) {
        Integer stockQuantity = request.getStockQuantity();
        if (partId == null || stockQuantity == null || stockQuantity < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid part ID or quantity"));
        }

        Stock stock = stockRepository.findByPartPartId(partId).orElse(null);
        if (stock == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Stock not found for this part"));
        }

        stock.setStockQuantity(stockQuantity);
        stockRepository.save(stock);

        StockDTO dto = new StockDTO(
                stock.getStockId(),
                stock.getPart().getPartId(),
                stock.getPart().getPartName(),
                stock.getStockQuantity()
        );

        return ResponseEntity.ok(dto);
    }

    @Override
    public ResponseEntity<?> adjustStock(Integer partId,AdjustStockRequest request) {
        if (request.getQuantityChange() == null || request.getQuantityChange() == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity change must be non-zero"));
        }

        SparePart part = sparePartRepository.findById(partId).orElse(null);
        if (part == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Part not found"));
        }

        Stock stock = stockRepository.findByPartPartId(part.getPartId()).orElse(null);
        if (stock == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Stock row not found for this part"));
        }

        int newQuantity = stock.getStockQuantity() + request.getQuantityChange();
        if (newQuantity < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Insufficient stock to remove"));
        }

        stock.setStockQuantity(newQuantity);
        stockRepository.save(stock);
        return ResponseEntity.ok(Map.of("message", "Stock adjusted", "stockQuantity", stock.getStockQuantity()));
    }
}