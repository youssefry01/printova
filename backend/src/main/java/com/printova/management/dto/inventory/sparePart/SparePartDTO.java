package com.printova.management.dto.inventory.sparePart;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SparePartDTO {

    private Integer partId;
    private String partName;
    private String partDescription;

    private String categoryName;
    private String supplierName;

    private BigDecimal currentPrice;
    private Integer stockQuantity;
}