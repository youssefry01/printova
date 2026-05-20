package com.printova.management.controller.cart;

import com.printova.management.dto.cart.*;
import com.printova.management.service.cart.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart() {
        return cartService.getCart();
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addToCart(request);
    }

    @DeleteMapping("/item/{partId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Integer partId) {
        return cartService.removeCartItem(partId);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        return cartService.clearCart();
    }

    @PutMapping("/item/{partId}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable Integer partId, @RequestBody UpdateCartItemRequest request) {
        return cartService.updateCartItemQuantity(partId, request);
    }
}
