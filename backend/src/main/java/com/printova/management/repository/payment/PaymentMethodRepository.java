package com.printova.management.repository.payment;

import com.printova.management.model.payment.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
    Optional<PaymentMethod> findByPaymentMethodId(Integer paymentMethodId);
    Optional<PaymentMethod> findByPaymentMethodCodeIgnoreCase(String paymentMethodCode);
    boolean existsByPaymentMethodCode(String code);
}