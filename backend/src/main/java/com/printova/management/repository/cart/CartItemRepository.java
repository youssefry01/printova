package com.printova.management.repository.cart;

import com.printova.management.model.cart.Cart;
import com.printova.management.model.cart.CartItem;
import com.printova.management.model.inventory.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartAndStock(Cart cart, Stock stock);
    Optional<CartItem> findByCartAndStock_Part_PartId(Cart cart, Integer partId);

    @Modifying
    @Transactional
    void deleteByCart(Cart cart);
}