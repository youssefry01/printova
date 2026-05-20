package com.printova.management.controller.order;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.printova.management.service.order.OrderService;
import com.printova.management.dto.order.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getMyOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getMyOrderById(orderId));
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasAnyRole('DELIVERY')")
    public ResponseEntity<?> getDeliveryOrders(
            @RequestParam(defaultValue = "PENDING") String status) {

        try {
            List<OrderResponse> orders =
                    orderService.getDeliveryOrdersByStatus(status);

            return ResponseEntity.ok(orders);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid status value",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to fetch orders",
                    "message", e.getMessage()
            ));
        }
    }

    // Update order status (delivery user marks completed)
    @PatchMapping("/delivery/complete/{orderId}")
    @PreAuthorize("hasAnyRole('DELIVERY')")
    public ResponseEntity<?> completeOrder(@PathVariable Long orderId) {

        try {
            OrderResponse updated = orderService.completeOrder(orderId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                "error", "Failed to complete order",
                "message", e.getMessage()
            ));
        }
    }

}