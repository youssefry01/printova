package com.printova.management.model.maintenance;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "maintenance_status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maintenanceStatusId;

    @Column(name = "maintenance_status", nullable = false)
    private String maintenanceStatus;
}