package com.printova.management.dto.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddPaymentMethodRequest {
    @NotBlank(message = "PaymentMethodCode is required")
    private String paymentMethodCode;

    @NotBlank(message = "PaymentMethodName is required")
    private String paymentMethodName;
}