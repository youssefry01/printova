package com.printova.management.dto.inventory.supplier;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSupplierRequest {
    private String supplierName;
    private String supplierEmail;
    private String supplierPhone;
}