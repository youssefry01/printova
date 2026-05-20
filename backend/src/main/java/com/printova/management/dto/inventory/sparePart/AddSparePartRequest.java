package com.printova.management.dto.inventory.sparePart;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddSparePartRequest {

    private String partName;
    private String partDescription;

    private Integer categoryId;
    private Integer supplierId;

    private BigDecimal initialPrice;
}