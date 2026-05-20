package com.printova.management.repository.order;

import com.printova.management.model.order.Order;
import com.printova.management.model.user.User;
import com.printova.management.model.order.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer_UserId(Long userId);
    int countByDeliveryUserAndOrderStatus(User deliveryUser, OrderStatus orderStatus);

    Optional<Order> findByOrderIdAndCustomer(Long orderId, User customer);

    @Query("SELECT o.deliveryUser, COUNT(o) FROM Order o WHERE o.deliveryUser IS NOT NULL AND o.orderStatus = :status GROUP BY o.deliveryUser ORDER BY COUNT(o) ASC")
    List<Object[]> countActiveOrdersByDeliveryUser(@Param("status") OrderStatus orderStatus);

    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByDeliveryUserOrderByCreatedAtDesc(User deliveryUser);
    List<Order> findByDeliveryUserAndOrderStatus(User deliveryUser, OrderStatus status);
}