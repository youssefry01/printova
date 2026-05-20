package com.printova.management.service.auth;

import com.printova.management.model.auth.RefreshToken;
import com.printova.management.model.user.User;

import java.util.List;

public interface RefreshTokenService {
    String generateRefreshToken(User user);
    RefreshToken fetchRefreshTokenByToken(String refreshToken);
    List<RefreshToken> fetchAllRefreshTokenByUserId(Long userId);
    void validateRefreshToken(String refreshToken);
    void saveAll(List<RefreshToken> refreshTokens);
}