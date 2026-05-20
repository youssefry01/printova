package com.printova.management.service.auth;

import com.printova.management.dto.auth.AuthRequest;
import com.printova.management.dto.auth.ChangePasswordRequest;
import com.printova.management.dto.auth.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface AuthService {
    ResponseEntity<?> register(RegisterRequest request, HttpServletResponse response);
    ResponseEntity<?> login(AuthRequest request, HttpServletResponse response);
    ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
    ResponseEntity<?> changePassword(ChangePasswordRequest request, HttpServletResponse response);
}