package com.printova.management.service.order;

import com.printova.management.dto.order.*;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {

    ResponseEntity<?> createOrder(CreateOrderRequest request);

    List<OrderResponse> getMyOrders();

    OrderResponse getMyOrderById(Long orderId);

    List<OrderResponse> getDeliveryOrdersByStatus(String status);

    OrderResponse completeOrder(Long orderId);

}