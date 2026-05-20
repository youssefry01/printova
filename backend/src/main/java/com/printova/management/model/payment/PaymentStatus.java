package com.printova.management.model.payment;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentStatusId;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;  // PENDING, COMPLETED, FAILED
}