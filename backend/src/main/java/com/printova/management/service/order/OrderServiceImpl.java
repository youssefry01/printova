package com.printova.management.service.order;

import com.printova.management.dto.order.*;
import com.printova.management.model.cart.Cart;
import com.printova.management.model.cart.CartItem;
import com.printova.management.model.inventory.ServiceFee;
import com.printova.management.model.inventory.Stock;
import com.printova.management.model.order.*;
import com.printova.management.model.payment.Payment;
import com.printova.management.model.payment.PaymentMethod;
import com.printova.management.model.payment.PaymentStatus;
import com.printova.management.model.user.User;
import com.printova.management.model.user.Role;
import com.printova.management.repository.cart.CartItemRepository;
import com.printova.management.repository.cart.CartRepository;
import com.printova.management.repository.inventory.ServiceFeeRepository;
import com.printova.management.repository.inventory.StockRepository;
import com.printova.management.repository.order.OrderRepository;
import com.printova.management.repository.order.OrderStatusRepository;
import com.printova.management.repository.payment.PaymentMethodRepository;
import com.printova.management.repository.payment.PaymentRepository;
import com.printova.management.repository.payment.PaymentStatusRepository;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.service.inventory.partPrice.PartPriceService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final PaymentRepository paymentRepository;
    private final PartPriceService partPriceService;
    private final RoleRepository roleRepository;
    private final ServiceFeeRepository serviceFeeRepository;
    private final OrderStatusRepository orderStatusRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> createOrder(CreateOrderRequest request) {

        if (request.getAddress() == null || request.getAddress().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Address is required"));
        }

        User customer = getCurrentUser();

        Cart cart = cartRepository.findByUser(customer).orElse(null);
        if (cart == null || cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cart is empty"));
        }

        // =========================
        // Get COD Payment Method
        // =========================
        PaymentMethod codMethod = paymentMethodRepository
                .findByPaymentMethodCodeIgnoreCase("COD")
                .orElseThrow(() -> new RuntimeException("COD payment method not found"));

        // =========================
        // Get DELIVERY Fee
        // =========================
        ServiceFee deliveryFee = serviceFeeRepository
                .findByServiceNameIgnoreCase("DELIVERY")
                .orElseThrow(() -> new RuntimeException("Delivery service fee not configured"));

        BigDecimal servicePrice = BigDecimal.valueOf(deliveryFee.getServicePrice());

        // =========================
        // Get PENDING status
        // =========================
        OrderStatus pendingStatus = orderStatusRepository
                .findByOrderStatusIgnoreCase("PENDING")
                .orElseThrow(() -> new RuntimeException("Pending order status not found"));

        // =========================
        // Select Delivery User with Least Active Orders
        // =========================
        Role deliveryRole = roleRepository
                .findByRoleNameIgnoreCase("DELIVERY")
                .orElseThrow(() -> new RuntimeException("Delivery role not found"));

        List<User> deliveryUsers = userRepository.findByRolesContaining(deliveryRole);

        User deliveryUser = deliveryUsers.stream()
                .min(Comparator.comparing(user -> orderRepository
                        .countByDeliveryUserAndOrderStatus(user, pendingStatus)))
                .orElseThrow(() -> new RuntimeException("No delivery users available"));

        // =========================
        // Create Order
        // =========================
        Order order = Order.builder()
                .customer(customer)
                .deliveryUser(deliveryUser)
                .paymentMethod(codMethod)
                .orderStatus(pendingStatus)
                .orderAddress(request.getAddress())
                .serviceId(deliveryFee.getServiceId())
                .servicePrice(deliveryFee.getServicePrice())
                .items(new ArrayList<>())
                .build();

        BigDecimal itemsTotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Stock stock = cartItem.getStock();

            if (cartItem.getQuantity() <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid quantity for part: " + stock.getPart().getPartName()));
            }

            if (stock.getStockQuantity() < cartItem.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Not enough stock for part: " + stock.getPart().getPartName()));
            }

            BigDecimal unitPrice = partPriceService.getLatestPriceValueByPartId(
                    stock.getPart().getPartId());

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            itemsTotal = itemsTotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .stock(stock)
                    .unitQuantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .build();

            order.getItems().add(orderItem);

            // Deduct stock safely
            stock.setStockQuantity(stock.getStockQuantity() - cartItem.getQuantity());
            stockRepository.save(stock);
        }

        order.setTotalAmount(itemsTotal.add(servicePrice));

        // =========================
        // Create PENDING Payment record
        // =========================
        PaymentStatus pendingPaymentStatus = paymentStatusRepository
                .findByPaymentStatusIgnoreCase("PENDING")
                .orElseThrow(() -> new RuntimeException("Pending payment status not configured"));

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(codMethod)
                .paymentAmount(order.getTotalAmount())
                .paymentStatus(pendingPaymentStatus)
                .build();

        if (payment == null) {
            throw new RuntimeException("Failed to create payment");
        }

        orderRepository.save(order);
        paymentRepository.save(payment);

        // Clear Cart in DB and in-memory
        cartItemRepository.deleteByCart(cart);
        cart.getItems().clear();

        return ResponseEntity.ok(buildOrderResponse(order));
    }

    private OrderResponse buildOrderResponse(Order order) {

        List<OrderItemResponse> items =
                order.getItems().stream().map(item -> {

                    BigDecimal total =
                            item.getUnitPrice().multiply(
                                    BigDecimal.valueOf(item.getUnitQuantity()));

                    return OrderItemResponse.builder()
                            .orderItemId(item.getOrderItemId())
                            .stockId(item.getStock().getStockId())
                            .partId(item.getStock().getPart().getPartId())
                            .quantity(item.getUnitQuantity())
                            .unitPrice(item.getUnitPrice())
                            .totalPrice(total)
                            .build();
                }).toList();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomer().getUserId())
                .deliveryUserId(order.getDeliveryUser().getUserId())
                .paymentMethod(order.getPaymentMethod().getPaymentMethodName())
                .status(order.getOrderStatus())
                .totalAmount(order.getTotalAmount())
                .serviceId(order.getServiceId())
                .servicePrice(order.getServicePrice())
                .address(order.getOrderAddress())
                .createdAt(order.getCreatedAt())
                .completedAt(order.getCompletedAt())
                .items(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User customer = getCurrentUser();

        List<Order> orders = orderRepository
                .findByCustomerOrderByCreatedAtDesc(customer);

        return orders.stream()
                .map(this::buildOrderResponse)
                .toList();
    }

        @Override
        @Transactional(readOnly = true)
        public OrderResponse getMyOrderById(Long orderId) {

                if (orderId == null) {
                        throw new RuntimeException("Order ID cannot be null");
                }

                User currentUser = getCurrentUser();

                Order order = orderRepository
                        .findByOrderIdAndCustomer(orderId, currentUser)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                return buildOrderResponse(order);
        }

        @Override
        @Transactional(readOnly = true)
        public List<OrderResponse> getDeliveryOrdersByStatus(String status) {

        if (status == null || status.isBlank()) {
                throw new IllegalArgumentException("Status must not be empty");
        }

        User deliveryUser = getCurrentUser();

        OrderStatus orderStatus = orderStatusRepository
                .findByOrderStatusIgnoreCase(status)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order status not found: " + status));

        List<Order> orders =
                orderRepository.findByDeliveryUserAndOrderStatus(
                        deliveryUser,
                        orderStatus
                );

        return orders.stream()
                .map(this::buildOrderResponse)
                .toList();
        }

    @Override
    @Transactional
    public OrderResponse completeOrder(Long orderId) {
        if (orderId == null) {
            throw new RuntimeException("Order ID cannot be null");
        }

        User deliveryUser = getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Ensure only assigned delivery user can update
        if (!order.getDeliveryUser().getUserId().equals(deliveryUser.getUserId())) {
            throw new RuntimeException("You are not authorized to update this order");
        }

        // Do not allow if order is cancelled
        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus().getOrderStatus())) {
            throw new RuntimeException("Cannot complete a cancelled order");
        }

        // Only allow completion if current status is PENDING
        if (!"PENDING".equalsIgnoreCase(order.getOrderStatus().getOrderStatus())) {
            throw new RuntimeException("Only pending orders can be completed");
        }

        OrderStatus completedStatus = orderStatusRepository
                .findByOrderStatusIgnoreCase("COMPLETED")
                .orElseThrow(() -> new RuntimeException("Completed order status not configured"));

        order.setOrderStatus(completedStatus);
        order.setCompletedAt(java.time.LocalDateTime.now());
        orderRepository.save(order);

        // =========================
        // Update Payment to COMPLETED
        // =========================
        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Payment record not found for order"));

        PaymentStatus completedPaymentStatus = paymentStatusRepository
                .findByPaymentStatusIgnoreCase("COMPLETED")
                .orElseThrow(() -> new RuntimeException("Completed payment status not configured"));

        payment.setPaymentStatus(completedPaymentStatus);
        paymentRepository.save(payment);

        return buildOrderResponse(order);
    }
}