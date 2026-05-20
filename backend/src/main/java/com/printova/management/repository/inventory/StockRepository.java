package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Integer> {
    Optional<Stock> findByStockId(Integer stockId);
    Optional<Stock> findByPartPartId(Integer partId);
}
