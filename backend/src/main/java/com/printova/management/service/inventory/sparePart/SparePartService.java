package com.printova.management.service.inventory.sparePart;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import com.printova.management.dto.inventory.sparePart.AddSparePartRequest;
import com.printova.management.dto.inventory.sparePart.UpdateSparePartRequest;

public interface SparePartService {
    ResponseEntity<?> addSparePart(AddSparePartRequest request);
    ResponseEntity<?> deleteSparePart(@NonNull Integer partId);
    ResponseEntity<?> updateSparePart(@NonNull Integer partId, UpdateSparePartRequest request);
    ResponseEntity<?> getAllSpareParts();
    ResponseEntity<?> getSparePartById(@NonNull Integer partId);
}