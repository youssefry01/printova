package com.printova.management.dto.order;

import lombok.*;

@Getter
@Setter
public class OrderItemRequest {

    private Integer productId;
    private Integer quantity;
    private Double unitPrice;
}