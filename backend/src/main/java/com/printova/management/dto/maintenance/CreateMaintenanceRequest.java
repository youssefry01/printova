package com.printova.management.dto.maintenance;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CreateMaintenanceRequest {
    private String address;
    private String description;
    private LocalDateTime date;
}