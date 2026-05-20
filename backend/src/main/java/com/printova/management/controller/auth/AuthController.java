package com.printova.management.controller.auth;

import com.printova.management.dto.auth.AuthRequest;
import com.printova.management.dto.auth.ChangePasswordRequest;
import com.printova.management.dto.auth.RegisterRequest;
import com.printova.management.exceptions.ResourceNotFoundException;
import com.printova.management.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import com.printova.management.model.user.User;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.dto.user.UserDTOMapper;
import com.printova.management.security.jwt.JwtService;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserDTOMapper userDTOMapper = new UserDTOMapper();

    public AuthController(AuthService authService, UserRepository userRepository, JwtService jwtService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Unauthorized: " + authHeader);
        }

        String jwt = authHeader.substring(7);
        String email = jwtService.getEmailFromJwtToken(jwt);
        if (email == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(userDTOMapper.apply(user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        return authService.register(request, response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        return authService.login(request, response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        return authService.refreshToken(request, response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, HttpServletResponse response) {
        return authService.changePassword(request, response);
    }
}