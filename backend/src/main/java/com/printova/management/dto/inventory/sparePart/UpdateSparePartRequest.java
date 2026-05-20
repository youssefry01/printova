package com.printova.management.dto.inventory.sparePart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSparePartRequest {
    private String partName;
    private String partDescription;
    private Integer categoryId;
    private Integer supplierId;
}