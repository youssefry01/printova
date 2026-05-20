package com.printova.management.controller.user;

import com.printova.management.dto.user.*;
import com.printova.management.service.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolesController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getAllRoles() {
        return roleService.getAllRoles();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> addRole(@RequestBody RoleRequest request) {
        return roleService.addRole(request.getRoleName());
    }

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getRoleById(@PathVariable(required = false) Integer roleId) {
        if (roleId == null) {
            return ResponseEntity.badRequest().build();
        }
        return roleService.getRoleById(roleId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addUserRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request
    ) {
        return roleService.addUserRole(userId, request.getRoleName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> removeUserRole(
            @PathVariable Long userId,
            @RequestBody RoleRequest request
    ) {
        return roleService.removeUserRole(userId, request.getRoleName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER') or #userId == principal.userId")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRoles(@PathVariable Long userId) {
        return roleService.getUserRoles(userId);
    }
}