package com.printova.management.dto.inventory.serviceFee;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddServiceFeeRequest {
    @NotBlank(message = "ServiceName is required")
    private String serviceName;
    
    @NotBlank(message = "ServicePrice is required")
    private Double servicePrice;
}