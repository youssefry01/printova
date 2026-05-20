package com.printova.management.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentDTO (
    Long paymentId,
    String paymentMethodName,
    String paymentStatus,
    BigDecimal paymentAmount,
    LocalDateTime paymentDate,
    Long orderId,
    Long maintenanceId
) {}