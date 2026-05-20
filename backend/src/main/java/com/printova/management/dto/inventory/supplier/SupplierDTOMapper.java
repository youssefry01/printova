package com.printova.management.dto.inventory.supplier;

import com.printova.management.model.inventory.Supplier;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class SupplierDTOMapper implements Function<Supplier, SupplierDTO> {

    @Override
    public SupplierDTO apply(Supplier supplier) {
        return new SupplierDTO(
                supplier.getSupplierId(),
                supplier.getSupplierName(),
                supplier.getSupplierEmail(),
                supplier.getSupplierPhone()
        );
    }
}