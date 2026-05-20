package com.printova.management.service.auth;

import com.printova.management.exceptions.ExpiredTokenException;
import com.printova.management.exceptions.InvalidTokenException;
import com.printova.management.exceptions.ResourceNotFoundException;
import com.printova.management.exceptions.RevokedTokenException;
import com.printova.management.model.auth.RefreshToken;
import com.printova.management.model.user.User;
import com.printova.management.repository.auth.RefreshTokenRepository;
import com.printova.management.security.utility.SecurityConstants;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.secret}")
    private String refreshSecret;

    private Key refreshKey;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostConstruct
    public void init() {
        this.refreshKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshSecret));
    }

    @Override
    public String generateRefreshToken(User user) {
        Date expirationDate = new Date(System.currentTimeMillis() + SecurityConstants.JWT_REFRESH_EXPIRATION);
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(refreshKey, SignatureAlgorithm.HS256)
                .compact();
        RefreshToken refreshToken = RefreshToken.builder()
                .refreshToken(token)
                .revoked(false)
                .issuedAt(new Date())
                .expiresAt(expirationDate)
                .user(user)
                .build();
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    @Override
    public RefreshToken fetchRefreshTokenByToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));
    }

    @Override
    public List<RefreshToken> fetchAllRefreshTokenByUserId(Long userId) {
        return refreshTokenRepository.findAllByUser_UserId(userId);
    }

    @Override
    public void validateRefreshToken(String refreshToken) {
        RefreshToken currentRefreshToken = fetchRefreshTokenByToken(refreshToken);

        if (currentRefreshToken.isRevoked()) {
            throw new RevokedTokenException("Refresh token is revoked");
        }

        if (currentRefreshToken.getExpiresAt().before(new Date())) {
            throw new ExpiredTokenException("Refresh token is expired");
        }

        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(refreshKey)
                    .build()
                    .parseClaimsJws(refreshToken);

            String type = claims.getBody().get("type", String.class);
            if (!"refresh".equals(type)) {
                throw new InvalidTokenException("Token is not a refresh token");
            }
        } catch (InvalidTokenException e) {
            throw e; // re-throw your own exceptions as-is
        } catch (Exception e) {
            throw new InvalidTokenException("Invalid refresh token");
        }
    }

    @Override
    @Transactional
    public void saveAll(List<RefreshToken> refreshTokens) {
        if (refreshTokens != null && !refreshTokens.isEmpty()) {
            refreshTokenRepository.saveAll(refreshTokens);
        }
    }
}