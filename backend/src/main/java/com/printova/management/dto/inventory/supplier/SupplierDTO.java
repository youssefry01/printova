package com.printova.management.dto.inventory.supplier;

public record SupplierDTO(
        Integer id,
        String supplierName,
        String supplierEmail,
        String supplierPhone
) {}