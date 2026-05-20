package com.printova.management.controller.inventory;

import com.printova.management.dto.inventory.stock.AdjustStockRequest;
import com.printova.management.dto.inventory.stock.UpdateStockRequest;
import com.printova.management.service.inventory.stock.StockService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/part/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getStockByPart(@PathVariable int partId) {
        return stockService.getStockByPartId(partId);
    }

    @PutMapping("/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> updateStock(@PathVariable int partId, @RequestBody UpdateStockRequest request) {
        return stockService.updateStock(partId, request);
    }

    @PostMapping("/{partId}/adjust")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> adjustStock(@PathVariable int partId, @RequestBody AdjustStockRequest request) {
        return stockService.adjustStock(partId, request);
    }

}