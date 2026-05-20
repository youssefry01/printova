package com.printova.management.dto.cart;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer partId;
    private Integer quantity;
}