package com.printova.management.controller.payment;

import com.printova.management.dto.payment.UpdatePaymentMethodRequest;
import com.printova.management.dto.payment.AddPaymentMethodRequest;
import com.printova.management.service.payment.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment-method")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getAllPaymentMethods() {
        return paymentMethodService.getAllPaymentMethods();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> addPaymentMethod(@RequestBody AddPaymentMethodRequest request) {
        return paymentMethodService.addPaymentMethod(request);
    }

    @GetMapping("/{paymentMethodId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getPaymentMethodById(@PathVariable int paymentMethodId) {
        return paymentMethodService.getPaymentMethodById(paymentMethodId);
    }

    @PutMapping("/{paymentMethodId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> updatePaymentMethod(@PathVariable int paymentMethodId, @RequestBody UpdatePaymentMethodRequest request) {
        return paymentMethodService.updatePaymentMethod(paymentMethodId, request);
    }

    @DeleteMapping("/{paymentMethodId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable int paymentMethodId) {
        return paymentMethodService.deletePaymentMethod(paymentMethodId);
    }
}
