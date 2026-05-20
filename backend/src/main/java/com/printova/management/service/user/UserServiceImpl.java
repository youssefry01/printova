package com.printova.management.service.user;

import com.printova.management.dto.user.UserDTO;
import com.printova.management.dto.user.UpdateUserRequest;
import com.printova.management.model.user.User;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.dto.user.UserDTOMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserDTOMapper userDTOMapper;

    public UserServiceImpl(UserRepository userRepository, UserDTOMapper userDTOMapper, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
    }

    @Override
    public ResponseEntity<?> updateUser(Long userId, UpdateUserRequest request) {
        if (userId == null){
            return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isEmpty()) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (userRepository.findByEmail(request.getEmail()).isPresent() &&
                    !user.getEmail().equals(request.getEmail())) {
                return ResponseEntity.status(400).body(Map.of("error", "Email already in use"));
            }
            user.setEmail(request.getEmail());
        }
        if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            user.setAddress(request.getAddress());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            var existingUserWithPhone = userRepository.findByPhone(request.getPhone());

            if (existingUserWithPhone.isPresent()
                    && !existingUserWithPhone.get().getEmail().equals(user.getEmail())) {
                return ResponseEntity.status(400).body(Map.of("error", "Phone Number already in use"));
            }

            user.setPhone(request.getPhone());
        }

        userRepository.save(user);
        return ResponseEntity.ok(userDTOMapper.apply(user));
    }

    @Override
    public ResponseEntity<?> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(userDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<?> getUserById(Long userId) {
        if (userId == null){
            return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
        }
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(userDTOMapper.apply(user));
    }
}