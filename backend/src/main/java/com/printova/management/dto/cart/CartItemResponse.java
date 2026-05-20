package com.printova.management.dto.cart;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private Integer cartItemId;

    private Integer stockId;
    private Integer partId;
    private String partName;

    private Integer quantity;
    private BigDecimal  unitPrice;

    private BigDecimal  totalPrice;
}