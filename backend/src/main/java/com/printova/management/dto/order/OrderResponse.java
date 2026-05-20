package com.printova.management.dto.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.printova.management.model.order.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long orderId;
    private Long customerId;
    private Long deliveryUserId;

    @JsonIgnore
    private OrderStatus status;

    @JsonProperty("orderStatus")
    public String getOrderStatus() {
        return status != null ? status.getOrderStatus() : null;
    }
    
    private String paymentMethod;
    private BigDecimal totalAmount;
    private Integer serviceId;
    private Double servicePrice;

    private String address;

    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}