package com.printova.management.dto.user;

import com.printova.management.model.user.User;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class UserDTOMapper implements Function<User, UserDTO> {

    @Override
    public UserDTO apply(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRoles().stream()
                        .map(role -> {
                            RoleRequest roleRequest = new RoleRequest();
                            roleRequest.setRoleName(role.getRoleName());
                            return roleRequest;
                        })
                        .collect(java.util.stream.Collectors.toSet())
        );
    }
}