package com.printova.management.dto.inventory.serviceFee;

public record ServiceFeeDTO(
        Integer id,
        String serviceName,
        Double servicePrice
) {}