package com.printova.management.service.cart;

import com.printova.management.dto.cart.*;
import com.printova.management.model.cart.Cart;
import com.printova.management.model.cart.CartItem;
import com.printova.management.model.user.User;
import com.printova.management.model.inventory.Stock;
import com.printova.management.repository.cart.CartRepository;
import com.printova.management.repository.cart.CartItemRepository;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.repository.inventory.StockRepository;
import com.printova.management.service.inventory.partPrice.PartPriceService;

import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final PartPriceService partPriceService;

    // =====================================================
    // AUTHENTICATED USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // =====================================================
    // ADD TO CART
    // =====================================================

    @Override
    @Transactional
    public ResponseEntity<?> addToCart(AddToCartRequest request) {

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Quantity must be greater than 0"));
        }

        User user = getCurrentUser();

        Stock stock = stockRepository
                .findByPartPartId(request.getPartId())
                .orElse(null);

        if (stock == null)
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Part not available in stock"));

        if (stock.getStockQuantity() < request.getQuantity())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Not enough stock available"));

        Cart cart = getOrCreateCart(user);

        CartItem existingItem =
                cartItemRepository.findByCartAndStock(cart, stock).orElse(null);

        if (existingItem != null) {

            int newQty = existingItem.getQuantity() + request.getQuantity();

            if (newQty > stock.getStockQuantity())
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Exceeds available stock"));

            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);

        } else {

            CartItem item = new CartItem();
            item.setCart(cart);
            item.setStock(stock);
            item.setQuantity(request.getQuantity());

            cartItemRepository.save(item);
        }

        return ResponseEntity.ok(Map.of("message", "Item added to cart"));
    }

    // =====================================================
    // GET CART
    // =====================================================

    @Override
    @Transactional
    public ResponseEntity<?> getCart() {

        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        List<CartItemResponse> items = cart.getItems().stream().map(item -> {

            Integer partId = item.getStock().getPart().getPartId();

            BigDecimal unitPrice =
                    partPriceService.getLatestPriceValueByPartId(partId);

            BigDecimal totalPrice =
                    unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            return CartItemResponse.builder()
                    .cartItemId(item.getCartItemId())
                    .stockId(item.getStock().getStockId())
                    .partId(partId)
                    .partName(item.getStock().getPart().getPartName())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .build();

        }).toList();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = CartResponse.builder()
                .cartId(cart.getCartId())
                .userId(user.getUserId())
                .items(items)
                .totalAmount(totalAmount)
                .build();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // UPDATE CART ITEM QUANTITY
    // =====================================================

    @Override
    @Transactional
    public ResponseEntity<?> updateCartItemQuantity(Integer partId, UpdateCartItemRequest request) {

        User currentUser = getCurrentUser();
        Cart cart = cartRepository.findByUser(currentUser).orElse(null);

        if (cart == null)
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Cart not found"));

        CartItem item = cartItemRepository
                .findByCartAndStock_Part_PartId(cart, partId)
                .orElse(null);

        if (item == null)
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Item not found in cart"));

        Integer quantity = request.getQuantity();

        if (quantity == null)
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Quantity required"));

        // 🔥 If 0 → remove
        if (quantity == 0) {
            cartItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }

        if (quantity < 0)
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Quantity cannot be negative"));

        Stock stock = item.getStock();

        if (quantity > stock.getStockQuantity())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Exceeds available stock"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return ResponseEntity.ok(Map.of("message", "Cart item updated"));
    }

    // =====================================================
    // REMOVE CART ITEM
    // =====================================================

    @Override
    @Transactional
    public ResponseEntity<?> removeCartItem(Integer partId) {

        User currentUser = getCurrentUser();

        Cart cart = cartRepository.findByUser(currentUser).orElse(null);

        if (cart == null)
            return ResponseEntity.ok(Map.of("message", "Cart already empty"));

        CartItem item = cartItemRepository
                .findByCartAndStock_Part_PartId(cart, partId)
                .orElse(null);

        if (item == null)
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Item not found in cart"));

        cartItemRepository.deleteById(item.getCartItemId());

        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    // =====================================================
    // CLEAR CART (Current User Only)
    // =====================================================

    @Override
    @Transactional
    public ResponseEntity<?> clearCart() {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUser(user).orElse(null);

        if (cart == null)
            return ResponseEntity.ok(Map.of("message", "Cart already empty"));

        cartItemRepository.deleteByCart(cart);

        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}