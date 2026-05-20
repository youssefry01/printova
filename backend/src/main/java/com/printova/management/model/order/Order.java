package com.printova.management.model.order;

import com.printova.management.model.user.User;
import com.printova.management.model.payment.PaymentMethod;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    // Customer
    @ManyToOne
    @JoinColumn(name = "customer_user_id", nullable = false)
    private User customer;

    // Delivery user
    @ManyToOne
    @JoinColumn(name = "delivery_user_id")
    private User deliveryUser;

    // Payment method
    @ManyToOne
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "order_status_id", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "service_id", nullable = false)
    private Integer serviceId;

    @Column(name = "service_price", nullable = false)
    private Double servicePrice;

    @Column(name = "order_address", nullable = false)
    private String orderAddress;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}