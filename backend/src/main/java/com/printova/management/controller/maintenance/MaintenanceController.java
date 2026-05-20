package com.printova.management.controller.maintenance;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.printova.management.service.maintenance.MaintenanceService;
import com.printova.management.dto.maintenance.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<?> createMaintenance(@RequestBody CreateMaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.createMaintenance(request));
    }

    @GetMapping
    public ResponseEntity<?> getMyMaintenances() {
        return ResponseEntity.ok(maintenanceService.getMyMaintenances());
    }

    @GetMapping("/{maintenanceId}")
    public ResponseEntity<?> getMyMaintenanceById(@PathVariable Long maintenanceId) {
        return ResponseEntity.ok(maintenanceService.getMyMaintenanceById(maintenanceId));
    }

    @GetMapping("/technician")
    @PreAuthorize("hasAnyRole('TECHNICIAN')")
    public ResponseEntity<?> getTechnicianMaintenances(@RequestParam(name = "status", defaultValue = "SCHEDULED") String status) {
        try {
            List<MaintenanceResponse> maintenances =
                    maintenanceService.getTechnicianMaintenancesByStatus(status);

            return ResponseEntity.ok(maintenances);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid status value",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to fetch maintenances",
                    "message", e.getMessage()
            ));
        }
    }

    @PatchMapping("/technician/complete/{maintenanceId}")
    @PreAuthorize("hasAnyRole('TECHNICIAN')")
    public ResponseEntity<?> completeMaintenance(@PathVariable Long maintenanceId) {

        try {
            MaintenanceResponse updated = maintenanceService.completeMaintenance(maintenanceId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                "error", "Failed to complete maintenance",
                "message", e.getMessage()
            ));
        }
    }

}