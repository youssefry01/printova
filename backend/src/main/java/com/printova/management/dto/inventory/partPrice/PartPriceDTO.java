package com.printova.management.dto.inventory.partPrice;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PartPriceDTO {

    private Integer priceId;
    private Integer partId;
    private BigDecimal price;
    private LocalDateTime validFrom;
}