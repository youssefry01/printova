package com.printova.management.controller.inventory;

import com.printova.management.dto.inventory.partPrice.AddPartPriceRequest;
import com.printova.management.service.inventory.partPrice.PartPriceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/part-price")
@RequiredArgsConstructor
public class PartPriceController {

    private final PartPriceService partPriceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> addPartPrice(@RequestBody AddPartPriceRequest request) {
        return partPriceService.addPrice(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getAllPartPrices() {
        return partPriceService.getAllPrices();
    }

    @GetMapping("/part/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> getPartPriceById(@PathVariable int partId) {
        return partPriceService.getPricesByPartId(partId);
    }
    
    @GetMapping("/part/{partId}/latest")
    public ResponseEntity<?> getLatestPrice(@PathVariable int partId) {
        return partPriceService.getLatestPriceByPartId(partId);
    }
}