package com.printova.management.controller.inventory;

import com.printova.management.dto.inventory.sparePart.*;
import com.printova.management.service.inventory.sparePart.SparePartService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/part")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    @GetMapping
    public ResponseEntity<?> getAllSpareParts() {
        return sparePartService.getAllSpareParts();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> addSparePart(@RequestBody AddSparePartRequest request) {
        return sparePartService.addSparePart(request);
    }

    @GetMapping("/{partId}")
    public ResponseEntity<?> getSparePartById(@PathVariable int partId) {
        return sparePartService.getSparePartById(partId);
    }

    @PutMapping("/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> updateSparePart(@PathVariable int partId, @RequestBody UpdateSparePartRequest request) {
        return sparePartService.updateSparePart(partId, request);
    }

    @DeleteMapping("/{partId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> deleteSparePart(@PathVariable int partId) {
        return sparePartService.deleteSparePart(partId);
    }
}