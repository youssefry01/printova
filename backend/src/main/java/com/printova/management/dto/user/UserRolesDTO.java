package com.printova.management.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserRolesDTO {
    private Long userId;
    private String email;
    private Set<String> roles;
}