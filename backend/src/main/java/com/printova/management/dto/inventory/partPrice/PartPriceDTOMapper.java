package com.printova.management.dto.inventory.partPrice;

import com.printova.management.model.inventory.PartPrice;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PartPriceDTOMapper implements Function<PartPrice, PartPriceDTO> {

    @Override
    public PartPriceDTO apply(PartPrice price) {
        return PartPriceDTO.builder()
                .priceId(price.getPriceId())
                .partId(price.getPart().getPartId())
                .price(price.getPrice())
                .validFrom(price.getValidFrom())
                .build();
    }
}