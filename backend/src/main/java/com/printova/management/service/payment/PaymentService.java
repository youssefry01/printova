package com.printova.management.service.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

public interface PaymentService {
    ResponseEntity<?> getAllPayments();
    ResponseEntity<?> getPaymentById(@NonNull Long paymentId);
}
