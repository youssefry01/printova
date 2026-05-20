package com.printova.management.service.payment;

import com.printova.management.dto.payment.AddPaymentMethodRequest;
import com.printova.management.dto.payment.UpdatePaymentMethodRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

public interface PaymentMethodService {
    ResponseEntity<?> addPaymentMethod(AddPaymentMethodRequest request);
    ResponseEntity<?> deletePaymentMethod(@NonNull Integer paymentMethodId);
    ResponseEntity<?> updatePaymentMethod(@NonNull Integer paymentMethodId, UpdatePaymentMethodRequest request);
    ResponseEntity<?> getAllPaymentMethods();
    ResponseEntity<?> getPaymentMethodById(@NonNull Integer paymentMethodId);
}