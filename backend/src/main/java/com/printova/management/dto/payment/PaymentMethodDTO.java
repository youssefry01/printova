package com.printova.management.dto.payment;

public record PaymentMethodDTO (
    Integer paymentMethodId,
    String paymentMethodCode,
    String paymentMethodName
) {}