package com.printova.management.service.user;

import com.printova.management.dto.user.UpdateUserRequest;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<?> updateUser(Long userId, UpdateUserRequest request);
    ResponseEntity<?> getAllUsers();
    ResponseEntity<?> getUserById(Long userId);
}