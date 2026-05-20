package com.printova.management.model.payment;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_method")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id")
    private Integer paymentMethodId;

    @Column(name = "payment_method_code", nullable = false, unique = true)
    private String paymentMethodCode;

    @Column(name = "payment_method_name", nullable = false)
    private String paymentMethodName;
}