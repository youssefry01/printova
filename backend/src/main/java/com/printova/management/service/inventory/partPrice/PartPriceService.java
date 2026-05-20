package com.printova.management.service.inventory.partPrice;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import com.printova.management.dto.inventory.partPrice.AddPartPriceRequest;

public interface PartPriceService {
    ResponseEntity<?> addPrice(AddPartPriceRequest request);

    ResponseEntity<?> getAllPrices();

    ResponseEntity<?> getPricesByPartId(@NonNull Integer partId);
    
    ResponseEntity<?> getLatestPriceByPartId(Integer partId);
    BigDecimal getLatestPriceValueByPartId(Integer partId);
}