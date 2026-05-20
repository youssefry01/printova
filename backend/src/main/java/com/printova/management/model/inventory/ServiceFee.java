package com.printova.management.model.inventory;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "serviceFee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceFee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serviceId;

    private String serviceName;
    
    private Double servicePrice;
}