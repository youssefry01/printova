package com.printova.management.dto.inventory.serviceFee;

import com.printova.management.model.inventory.ServiceFee;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class ServiceFeeDTOMapper implements Function<ServiceFee, ServiceFeeDTO> {

    @Override
    public ServiceFeeDTO apply(ServiceFee service) {
        return new ServiceFeeDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getServicePrice()
        );
    }
}