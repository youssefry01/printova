package com.printova.management.security.configuration;

import com.printova.management.model.user.Role;
import com.printova.management.model.user.User;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Transactional
public class SystemRoleInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "password";

    @Override
    public void run(String... args) {

        // Create roles
        Role adminRole = createRoleIfNotExists("ADMIN");
        Role managerRole = createRoleIfNotExists("MANAGER");
        Role deliveryRole = createRoleIfNotExists("DELIVERY");
        Role technicianRole = createRoleIfNotExists("TECHNICIAN");
        Role customerRole = createRoleIfNotExists("CUSTOMER");

        // Admin
        createUserIfNotExists("Admin", "Printova", "admin@printova.com", "HQ", "100000000", adminRole);

        // Managers
        createUserIfNotExists("Manager", "Printova", "manager@printova.com", "Office", "100000001", managerRole);
        createUserIfNotExists("Manager2", "Printova", "manager2@printova.com", "Office", "100000002", managerRole);

        // Delivery
        createUserIfNotExists("Delivery", "Printova", "delivery@printova.com", "Warehouse", "100000003", deliveryRole);
        createUserIfNotExists("Delivery2", "Printova", "delivery2@printova.com", "Warehouse", "100000004", deliveryRole);

        // Technicians
        createUserIfNotExists("Technician", "Printova", "technician@printova.com", "Workshop", "100000005", technicianRole);
        createUserIfNotExists("Technician2", "Printova", "technician2@printova.com", "Workshop", "100000006", technicianRole);

        // Customers
        createUserIfNotExists("Youssef", "Ramadan", "youssef@printova.com", "City", "100000100", customerRole);
        createUserIfNotExists("John", "Doe", "john@printova.com", "City", "100000101", customerRole);
    }

    private Role createRoleIfNotExists(String roleName) {
        return roleRepository.findByRoleNameIgnoreCase(roleName)
                .orElseGet(() ->
                        roleRepository.save(
                                Role.builder()
                                        .roleName(roleName)
                                        .build()
                        )
                );
    }

    private void createUserIfNotExists(
            String firstName,
            String lastName,
            String email,
            String address,
            String phone,
            Role role
    ) {

        if (userRepository.findByEmail(email).isPresent()) {
            return;
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .address(address)
                .phone(phone)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        userRepository.save(user);
    }
}