package com.printova.management.dto.cart;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private Integer cartId;
    private Long userId;

    private List<CartItemResponse> items;

    private BigDecimal  totalAmount;
}