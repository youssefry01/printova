package com.printova.management.dto.inventory.partPrice;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddPartPriceRequest {

    private Integer partId;
    private BigDecimal price;
}