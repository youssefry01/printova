package com.printova.management.dto.inventory.stock;

import lombok.Data;

@Data
public class AdjustStockRequest {
    private Integer quantityChange; // positive = add, negative = remove
}