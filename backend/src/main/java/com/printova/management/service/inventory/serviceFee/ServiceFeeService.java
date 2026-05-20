package com.printova.management.service.inventory.serviceFee;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import com.printova.management.dto.inventory.serviceFee.AddServiceFeeRequest;
import com.printova.management.dto.inventory.serviceFee.UpdateServiceFeeRequest;

public interface ServiceFeeService {
    ResponseEntity<?> addService(AddServiceFeeRequest request);
    ResponseEntity<?> deleteService(@NonNull Integer serviceId);
    ResponseEntity<?> updateService(@NonNull Integer serviceId, UpdateServiceFeeRequest request);
    ResponseEntity<?> getAllServices();
    ResponseEntity<?> getServiceById(@NonNull Integer serviceId);
    ResponseEntity<?> getServiceByName(@NonNull String serviceName);
}