package com.printova.management.service.inventory.serviceFee;

import com.printova.management.dto.inventory.serviceFee.AddServiceFeeRequest;
import com.printova.management.dto.inventory.serviceFee.ServiceFeeDTO;
import com.printova.management.dto.inventory.serviceFee.ServiceFeeDTOMapper;
import com.printova.management.dto.inventory.serviceFee.UpdateServiceFeeRequest;
import com.printova.management.model.inventory.ServiceFee;
import com.printova.management.repository.inventory.ServiceFeeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ServiceFeeServiceImpl implements ServiceFeeService {
    private final ServiceFeeRepository serviceFeeRepository;
    private final ServiceFeeDTOMapper serviceFeeDTOMapper;

    public ServiceFeeServiceImpl(ServiceFeeRepository serviceFeeRepository, ServiceFeeDTOMapper serviceFeeDTOMapper) {
        this.serviceFeeRepository = serviceFeeRepository;
        this.serviceFeeDTOMapper = serviceFeeDTOMapper;
    }

    @Override
    public ResponseEntity<?> addService(AddServiceFeeRequest request) {
        ServiceFee service = ServiceFee.builder()
                .serviceName(request.getServiceName())
                .servicePrice(request.getServicePrice())
                .build();
        if (service != null) {
            serviceFeeRepository.save(service);
            return ResponseEntity.ok(serviceFeeDTOMapper.apply(service));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to create service fee"));
    }

    @Override
    public ResponseEntity<?> deleteService(Integer serviceId) {
        if (serviceId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Service ID cannot be null"));
        }

        ServiceFee service = serviceFeeRepository.findById(serviceId).orElse(null);
        if (service != null) {
            serviceFeeRepository.delete(service);
            return ResponseEntity.ok(Map.of("message", "Service fee deleted successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to delete service fee"));
    }

    @Override
    public ResponseEntity<?> updateService(Integer serviceId, UpdateServiceFeeRequest request) {
        if (serviceId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Service ID cannot be null"));
        }
        
        ServiceFee service = serviceFeeRepository.findById(serviceId).orElse(null);
        if (service == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Service fee not found"));
        }
        if (request.getServiceName() != null && !request.getServiceName().isEmpty()) {
            service.setServiceName(request.getServiceName());
        }
        if (request.getServicePrice() != null) {
            service.setServicePrice(request.getServicePrice());
        }

        serviceFeeRepository.save(service);

        return ResponseEntity.ok(serviceFeeDTOMapper.apply(service));
    }

    @Override
    public ResponseEntity<?> getAllServices() {
        List<ServiceFeeDTO> services = serviceFeeRepository.findAll().stream()
                .map(serviceFeeDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }

    @Override
    public ResponseEntity<?> getServiceById(Integer serviceId) {
        if (serviceId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Service ID cannot be null"));
        }
        
        ServiceFee service = serviceFeeRepository.findById(serviceId).orElse(null);
        if (service == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Service not found"));
        }
        return ResponseEntity.ok(serviceFeeDTOMapper.apply(service));
    }

    @Override
    public ResponseEntity<?> getServiceByName(String serviceName) {
        if (serviceName == null || serviceName.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "Service name cannot be null or empty"));
        }
        
        ServiceFee service = serviceFeeRepository.findByServiceNameIgnoreCase(serviceName).orElse(null);
        if (service == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Service not found"));
        }
        return ResponseEntity.ok(serviceFeeDTOMapper.apply(service));
    }
}