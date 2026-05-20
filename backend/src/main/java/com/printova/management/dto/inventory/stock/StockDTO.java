package com.printova.management.dto.inventory.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {
    private Integer stockId;
    private Integer partId;
    private String partName;
    private Integer stockQuantity;
}