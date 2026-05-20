package com.printova.management.dto.user;

import java.util.Set;

public record UserDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        Set<RoleRequest> roles
) {}