package com.printova.management.service.user;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

public interface RoleService {
    ResponseEntity<?> getAllRoles();
    ResponseEntity<?> addRole(String roleName);
    ResponseEntity<?> getRoleById(@NonNull Integer roleId);
    ResponseEntity<?> getUserRoles(Long userId);
    ResponseEntity<?> addUserRole(Long userId, String roleName);
    ResponseEntity<?> removeUserRole(Long userId, String roleName);
}