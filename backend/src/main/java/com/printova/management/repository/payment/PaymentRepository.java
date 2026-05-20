package com.printova.management.repository.payment;

import com.printova.management.model.payment.Payment;
import com.printova.management.model.maintenance.Maintenance;
import com.printova.management.model.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentId(Long paymentId);
    Optional<Payment> findByOrder(Order order);
    Optional<Payment> findByMaintenance(Maintenance maintenance);
}