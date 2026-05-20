package com.printova.management.service.payment;

import com.printova.management.dto.payment.*;
import com.printova.management.model.payment.Payment;
import com.printova.management.repository.payment.PaymentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.lang.NonNull;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentDTOMapper paymentDTOMapper;

    public PaymentServiceImpl(PaymentRepository paymentRepository, PaymentDTOMapper paymentDTOMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentDTOMapper = paymentDTOMapper;
    }

    @Override
    public ResponseEntity<?> getAllPayments() {
        List<PaymentDTO> payments = paymentRepository.findAll().stream()
                .map(paymentDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(payments);
    }

    @Override
    public ResponseEntity<?> getPaymentById(@NonNull Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment  not found"));
        }
        return ResponseEntity.ok(paymentDTOMapper.apply(payment));
    }
}