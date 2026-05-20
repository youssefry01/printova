package com.printova.management.service.cart;

import com.printova.management.dto.cart.AddToCartRequest;
import com.printova.management.dto.cart.UpdateCartItemRequest;
import org.springframework.http.ResponseEntity;

public interface CartService {

    ResponseEntity<?> addToCart(AddToCartRequest request);

    ResponseEntity<?> getCart();

    ResponseEntity<?> updateCartItemQuantity(Integer partId, UpdateCartItemRequest request);

    ResponseEntity<?> removeCartItem(Integer cartItemId);

    ResponseEntity<?> clearCart();
}