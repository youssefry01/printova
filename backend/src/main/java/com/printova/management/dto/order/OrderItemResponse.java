package com.printova.management.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {

    private Long orderItemId;
    private Integer stockId;
    private Integer partId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}