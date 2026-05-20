package com.printova.management.service.inventory.stock;

import com.printova.management.dto.inventory.stock.AdjustStockRequest;
import com.printova.management.dto.inventory.stock.UpdateStockRequest;
import org.springframework.http.ResponseEntity;

public interface StockService {
    ResponseEntity<?> getAllStocks();
    ResponseEntity<?> getStockByPartId(Integer partId);
    ResponseEntity<?> adjustStock(Integer partId, AdjustStockRequest request);
    ResponseEntity<?> updateStock(Integer partId, UpdateStockRequest request);
}