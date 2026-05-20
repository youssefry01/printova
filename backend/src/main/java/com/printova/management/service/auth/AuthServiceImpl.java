package com.printova.management.service.auth;

import com.printova.management.dto.auth.*;
import com.printova.management.dto.user.UserDTOMapper;
import com.printova.management.exceptions.InvalidTokenException;
import com.printova.management.exceptions.ResourceNotFoundException;
import com.printova.management.model.auth.RefreshToken;
import com.printova.management.model.user.User;
import com.printova.management.model.user.Role;
import com.printova.management.repository.user.UserRepository;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.security.jwt.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import static com.printova.management.security.utility.SecurityUtils.extractRefreshToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserDTOMapper userDTOMapper;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final RoleRepository roleRepository;

    public AuthServiceImpl(UserRepository userRepository,
                           JwtService jwtService, PasswordEncoder passwordEncoder,
                           UserDTOMapper userDTOMapper, AuthenticationManager authenticationManager,
                           RefreshTokenService refreshTokenService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userDTOMapper = userDTOMapper;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.roleRepository = roleRepository;
    }

    @Override
    public ResponseEntity<?> register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use: " + request.getPhone());
        }

        Role customerRole = roleRepository.findByRoleNameIgnoreCase("CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name CUSTOMER"));
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .address(request.getAddress())
                .roles(Set.of(customerRole))
                .build();

        if (user == null) {
            throw new IllegalArgumentException("Failed to create user");
        }
        User savedUser = userRepository.save(user);
        String accessToken = jwtService.generateJwtToken(savedUser);
        String refreshToken = refreshTokenService.generateRefreshToken(savedUser);
        setRefreshTokenCookie(response, refreshToken);

        return ResponseEntity.ok(AuthResponse.builder()
                .userDTO(userDTOMapper.apply(savedUser))
                .accessToken(accessToken)
                .build());
    }

    @Override
    public ResponseEntity<?> login(AuthRequest request, HttpServletResponse response) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email must be provided");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password must be provided");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        revokeAllUserTokens(user);
        String jwtToken = jwtService.generateJwtToken(user);
        String refreshToken = refreshTokenService.generateRefreshToken(user);
        setRefreshTokenCookie(response, refreshToken);
        
        AuthResponse logInResponse = AuthResponse.builder()
                .userDTO(userDTOMapper.apply(user))
                .accessToken(jwtToken)
                .build();

        return ResponseEntity.ok(logInResponse);
    }

    @Override
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            throw new InvalidTokenException("Refresh token missing");
        }

        refreshTokenService.validateRefreshToken(refreshToken);
        String email = jwtService.getEmailFromRefreshToken(refreshToken);
        if (email == null) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        revokeAllUserTokens(user);
        String newAccessToken = jwtService.generateJwtToken(user);
        String newRefreshToken = refreshTokenService.generateRefreshToken(user);
        setRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok(AuthResponse.builder()
                .userDTO(userDTOMapper.apply(user))
                .accessToken(newAccessToken)
                .build());
    }

    @Override
    public ResponseEntity<?> changePassword(ChangePasswordRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (request.getOldPassword() == null || request.getOldPassword().isBlank() ||
            request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("Old password and new password must be provided");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        revokeAllUserTokens(user);

        String newAccessToken = jwtService.generateJwtToken(user);
        String newRefreshToken = refreshTokenService.generateRefreshToken(user);

        setRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok(AuthResponse.builder()
                .userDTO(userDTOMapper.apply(user))
                .accessToken(newAccessToken)
                .build());
    }

    private void revokeAllUserTokens(User user) {
        List<RefreshToken> validRefreshTokens = refreshTokenService
            .fetchAllRefreshTokenByUserId(user.getUserId().longValue());
        if (!validRefreshTokens.isEmpty()) {
            validRefreshTokens.forEach(token -> {
                token.setRevoked(true);
            });
            refreshTokenService.saveAll(validRefreshTokens);
        }
    }

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // false in dev, true in prod
        cookie.setPath("/api/auth");
        cookie.setMaxAge(30 * 24 * 60 * 60);
        response.addCookie(cookie);
    }
}