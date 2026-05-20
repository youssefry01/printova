package com.printova.management.service.inventory.partPrice;

import com.printova.management.model.inventory.SparePart;
import com.printova.management.model.inventory.PartPrice;
import com.printova.management.dto.inventory.partPrice.PartPriceDTOMapper;
import com.printova.management.dto.inventory.partPrice.AddPartPriceRequest;
import com.printova.management.dto.inventory.partPrice.PartPriceDTO;
import com.printova.management.repository.inventory.SparePartRepository;
import com.printova.management.repository.inventory.PartPriceRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PartPriceServiceImpl implements PartPriceService {
    private final PartPriceRepository partPriceRepository;
    private final SparePartRepository sparePartRepository;
    private final PartPriceDTOMapper partPriceDTOMapper;

    public PartPriceServiceImpl(PartPriceRepository partPriceRepository, SparePartRepository sparePartRepository, PartPriceDTOMapper partPriceDTOMapper) {
        this.partPriceRepository = partPriceRepository;
        this.sparePartRepository = sparePartRepository;
        this.partPriceDTOMapper = partPriceDTOMapper;
    }

    @Override
    public ResponseEntity<?> addPrice(AddPartPriceRequest request) {

        if (request == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Request body cannot be null"));
        }

        if (request.getPartId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Part ID is required"));
        }

        if (request.getPrice() == null ||
                request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Price must be greater than 0"));
        }

        SparePart part = sparePartRepository
                .findById(request.getPartId())
                .orElse(null);

        if (part == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Spare part not found"));
        }

        PartPrice price = PartPrice.builder()
                .part(part)
                .price(request.getPrice())
                .validFrom(LocalDateTime.now())
                .build();

        partPriceRepository.save(price);

        return ResponseEntity.ok(partPriceDTOMapper.apply(price));
    }

    @Override
    public ResponseEntity<?> getAllPrices() {

        List<PartPriceDTO> prices = partPriceRepository.findAll()
                .stream()
                .map(partPriceDTOMapper)
                .collect(Collectors.toList());

        return ResponseEntity.ok(prices);
    }

    @Override
    public ResponseEntity<?> getPricesByPartId(Integer partId) {

        if (partId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Part ID cannot be null"));
        }

        List<PartPriceDTO> prices = partPriceRepository
                .findByPartPartIdOrderByValidFromDesc(partId)
                .stream()
                .map(partPriceDTOMapper)
                .collect(Collectors.toList());

        return ResponseEntity.ok(prices);
    }

    @Override
    public ResponseEntity<?> getLatestPriceByPartId(Integer partId) {

        if (partId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Part ID cannot be null"));
        }

        PartPrice latestPrice = partPriceRepository
                .findTopByPartPartIdOrderByValidFromDesc(partId)
                .orElse(null);

        if (latestPrice == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "No price found for this part"));
        }

        return ResponseEntity.ok(partPriceDTOMapper.apply(latestPrice));
    }

    @Override
    public BigDecimal getLatestPriceValueByPartId(Integer partId) {

        return partPriceRepository
                .findTopByPartPartIdOrderByValidFromDesc(partId)
                .map(PartPrice::getPrice)
                .orElse(BigDecimal.ZERO);
    }
}