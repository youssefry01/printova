package com.printova.management.dto.inventory.serviceFee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateServiceFeeRequest {
    private String serviceName;
    private Double servicePrice;
}