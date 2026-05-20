package com.printova.management.service.user;

import com.printova.management.model.user.User;
import com.printova.management.model.user.Role;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.dto.user.RoleDTO;
import com.printova.management.dto.user.UserRolesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public ResponseEntity<?> getUserRoles(Long userId) {

        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());

        UserRolesDTO response = new UserRolesDTO(user.getUserId(), user.getUsername(),roles);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<?> addRole(String roleName) {

        if (roleName == null || roleName.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Role name cannot be empty"));
        }

        if (roleRepository.findByRoleNameIgnoreCase(roleName.trim()).isPresent()) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Role already exists"));
        }

        Role role = new Role();
        role.setRoleName(roleName.trim().toUpperCase());
        roleRepository.save(role);

        return ResponseEntity.ok(Map.of("message", "Role added successfully"));
    }

    @Override
    public ResponseEntity<?> addUserRole(Long userId, String roleName) {

        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByRoleNameIgnoreCase(roleName.trim())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!canModifyRole(auth, role)) {
            return ResponseEntity.status(403).body("You are not allowed to add this role");
        }

        if (user.getRoles().contains(role)) {
            return ResponseEntity.badRequest().body("User already has this role");
        }

        user.getRoles().add(role);
        userRepository.save(user);
        return ResponseEntity.ok("Role added successfully");
    }

    @Override
    public ResponseEntity<?> removeUserRole(Long userId, String roleName) {

        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByRoleNameIgnoreCase(roleName.trim())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Prevent self-removal of ADMIN
        if (user.getEmail().equals(auth.getName()) && role.getRoleName().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest().body("You cannot remove your own ADMIN role");
        }

        boolean isProtectedAdmin = user.getEmail().equalsIgnoreCase("admin@printova.com");
        boolean newRoleIsAdmin = role.getRoleName().equalsIgnoreCase("ADMIN");
        if (isProtectedAdmin && newRoleIsAdmin) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "This admin account cannot be downgraded"));
        }

        // Check permission
        if (!canModifyRole(auth, role)) {
            return ResponseEntity.status(403).body("You are not allowed to remove this role");
        }

        if (!user.getRoles().contains(role)) {
            return ResponseEntity.badRequest().body("User does not have this role");
        }

        // Ensure at least one role remains
        if (user.getRoles().size() == 1) {
            return ResponseEntity.badRequest().body("User must have at least one role");
        }

        user.getRoles().remove(role);
        userRepository.save(user);
        return ResponseEntity.ok("Role removed successfully");
    }

    private boolean canModifyRole(Authentication auth, Role targetRole) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isManager = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));

        if (isAdmin) return true; // Admin can do anything

        if (isManager) {
            // Manager can only modify DELIVERY or TECHNICIAN
            String roleName = targetRole.getRoleName().toUpperCase();
            return roleName.equals("DELIVERY") || roleName.equals("TECHNICIAN") || roleName.equals("CUSTOMER");
        }

        return false; // other users cannot modify roles
    }

    @Override
    public ResponseEntity<?> getAllRoles() {

        List<RoleDTO> roles = roleRepository.findAll().stream()
                .map(role -> new RoleDTO(
                        role.getRoleId(),
                        role.getRoleName()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(roles);
    }

    @Override
    public ResponseEntity<?> getRoleById(@NonNull Integer roleId) {

        Role role = roleRepository.findById(roleId).orElse(null);

        if (role == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Role not found"));
        }

        RoleDTO roleDTO = new RoleDTO(
                role.getRoleId(),
                role.getRoleName()
        );

        return ResponseEntity.ok(roleDTO);
    }
}