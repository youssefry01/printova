package com.printova.management.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentMethodRequest {
    private String paymentMethodCode;
    private String paymentMethodName;
}