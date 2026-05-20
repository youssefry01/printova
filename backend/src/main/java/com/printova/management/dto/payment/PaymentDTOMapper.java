package com.printova.management.dto.payment;

import com.printova.management.model.payment.Payment;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PaymentDTOMapper implements Function<Payment, PaymentDTO> {

    @Override
    public PaymentDTO apply(Payment payment) {
        return new PaymentDTO(
                payment.getPaymentId(),
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().getPaymentMethodName() : null,
                payment.getPaymentStatus() != null ? payment.getPaymentStatus().getPaymentStatus() : null,
                payment.getPaymentAmount(),
                payment.getPaymentDate(),
                payment.getOrder() != null ? payment.getOrder().getOrderId() : null,
                payment.getMaintenance() != null ? payment.getMaintenance().getMaintenanceId() : null
        );
    }
}