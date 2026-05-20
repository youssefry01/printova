package com.printova.management.controller.inventory;

import com.printova.management.dto.inventory.serviceFee.AddServiceFeeRequest;
import com.printova.management.dto.inventory.serviceFee.UpdateServiceFeeRequest;
import com.printova.management.service.inventory.serviceFee.ServiceFeeService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/service")
@RequiredArgsConstructor
public class ServiceFeeController {

    private final ServiceFeeService serviceFeeService;

    @GetMapping
    public ResponseEntity<?> getAllServices() {
        return serviceFeeService.getAllServices();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> addService(@RequestBody AddServiceFeeRequest request) {
        return serviceFeeService.addService(request);
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<?> getServiceById(@PathVariable int serviceId) {
        return serviceFeeService.getServiceById(serviceId);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getServiceByName(@PathVariable String name) {
        return serviceFeeService.getServiceByName(name);
    }
    
    @PutMapping("/{serviceId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> updateService(@PathVariable int serviceId, @RequestBody UpdateServiceFeeRequest request) {
        return serviceFeeService.updateService(serviceId, request);
    }

    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> deleteService(@PathVariable int serviceId) {
        return serviceFeeService.deleteService(serviceId);
    }
}