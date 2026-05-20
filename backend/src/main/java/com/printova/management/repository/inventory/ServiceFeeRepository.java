package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.ServiceFee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ServiceFeeRepository extends JpaRepository<ServiceFee, Integer> {
    Optional<ServiceFee> findByServiceId(Integer serviceId);
    Optional<ServiceFee> findByServiceNameIgnoreCase(String serviceName);
}

