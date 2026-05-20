package com.printova.management.model.maintenance;

import com.printova.management.model.user.User;
import com.printova.management.model.payment.PaymentMethod;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maintenance_id")
    private Long maintenanceId;

    // Customer
    @ManyToOne
    @JoinColumn(name = "customer_user_id", nullable = false)
    private User customer;

    // Technician user
    @ManyToOne
    @JoinColumn(name = "technician_user_id")
    private User technicianUser;

    // Payment method
    @ManyToOne
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "maintenance_status_id", nullable = false)
    private MaintenanceStatus maintenanceStatus;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "service_id", nullable = false)
    private Integer serviceId;

    @Column(name = "service_price", nullable = false)
    private Double servicePrice;

    @Column(name = "maintenance_address", nullable = false)
    private String maintAddress;

    @Column(name = "maintenance_date", nullable = false)
    private LocalDateTime maintDate;

    @Column(name = "maintenance_description", nullable = false)
    private String maintDescription;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}