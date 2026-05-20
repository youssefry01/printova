package com.printova.management.dto.maintenance;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.printova.management.model.maintenance.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MaintenanceResponse {

    private Long maintenanceId;
    private Long customerId;
    private Long technicianUserId;

    @JsonIgnore
    private MaintenanceStatus status;

    @JsonProperty("maintenanceStatus")
    public String getMaintenanceStatus() {
        return status != null ? status.getMaintenanceStatus() : null;
    }

    private String paymentMethod;
    private BigDecimal totalAmount;
    private Integer serviceId;
    private Double servicePrice;

    private String address;

    private String description;

    private LocalDateTime date;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;
}