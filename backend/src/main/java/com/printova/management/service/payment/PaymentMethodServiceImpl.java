package com.printova.management.service.payment;

import com.printova.management.dto.payment.AddPaymentMethodRequest;
import com.printova.management.dto.payment.PaymentMethodDTO;
import com.printova.management.dto.payment.PaymentMethodDTOMapper;
import com.printova.management.dto.payment.UpdatePaymentMethodRequest;
import com.printova.management.model.payment.PaymentMethod;
import com.printova.management.repository.payment.PaymentMethodRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.lang.NonNull;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodDTOMapper paymentMethodDTOMapper;

    public PaymentMethodServiceImpl(PaymentMethodRepository paymentMethodRepository, PaymentMethodDTOMapper paymentMethodDTOMapper) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.paymentMethodDTOMapper = paymentMethodDTOMapper;
    }

    @Override
    public ResponseEntity<?> addPaymentMethod(AddPaymentMethodRequest request) {
        PaymentMethod paymentMethod = PaymentMethod.builder()
                .paymentMethodCode(request.getPaymentMethodCode())
                .paymentMethodName(request.getPaymentMethodName())
                .build();
        if (paymentMethod != null) {
            paymentMethodRepository.save(paymentMethod);
            return ResponseEntity.ok(paymentMethodDTOMapper.apply(paymentMethod));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to create payment method"));
    }

    @Override
    public ResponseEntity<?> deletePaymentMethod(@NonNull Integer paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId).orElse(null);
        if (paymentMethod != null) {
            paymentMethodRepository.delete(paymentMethod);
            return ResponseEntity.ok(Map.of("message", "Payment Method deleted successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to delete payment method"));
    }

    @Override
    public ResponseEntity<?> updatePaymentMethod(@NonNull Integer paymentMethodId, UpdatePaymentMethodRequest request) {
        
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId).orElse(null);
        if (paymentMethod == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment Method not found"));
        }

        if (request.getPaymentMethodCode() != null && !request.getPaymentMethodCode().isEmpty()) {
            paymentMethod.setPaymentMethodCode(request.getPaymentMethodCode());
        }

        if (request.getPaymentMethodName() != null && !request.getPaymentMethodName().isEmpty()) {
            paymentMethod.setPaymentMethodName(request.getPaymentMethodName());
        }

        paymentMethodRepository.save(paymentMethod);
        return ResponseEntity.ok(paymentMethodDTOMapper.apply(paymentMethod));
    }

    @Override
    public ResponseEntity<?> getAllPaymentMethods() {
        List<PaymentMethodDTO> paymentMethods = paymentMethodRepository.findAll().stream()
                .map(paymentMethodDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(paymentMethods);
    }

    @Override
    public ResponseEntity<?> getPaymentMethodById(@NonNull Integer paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId).orElse(null);
        if (paymentMethod == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment Method not found"));
        }
        return ResponseEntity.ok(paymentMethodDTOMapper.apply(paymentMethod));
    }
}