package com.printova.management.service.maintenance;

import com.printova.management.dto.maintenance.*;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MaintenanceService {

    ResponseEntity<?> createMaintenance(CreateMaintenanceRequest request);

    List<MaintenanceResponse> getMyMaintenances();
    
    MaintenanceResponse getMyMaintenanceById(Long maintenanceId);

    List<MaintenanceResponse> getTechnicianMaintenancesByStatus(String status);

    MaintenanceResponse completeMaintenance(Long maintenanceId);

}