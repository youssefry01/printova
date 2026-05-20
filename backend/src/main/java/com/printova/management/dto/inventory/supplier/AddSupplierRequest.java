package com.printova.management.dto.inventory.supplier;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddSupplierRequest {
    @NotBlank(message = "SupplierName is required")
    private String supplierName;

    @NotBlank(message = "SupplierEmail is required")
    private String supplierEmail;
    
    private String supplierPhone;
}