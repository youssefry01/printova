package com.printova.management.repository.auth;

import com.printova.management.model.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Date;

@Repository
@Transactional(readOnly = true)
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

        Optional<RefreshToken> findByRefreshToken(String refreshToken);

        List<RefreshToken> findAllByUser_UserId(Long userId);

        @Modifying
        @Transactional
        @Query("UPDATE RefreshToken rt SET rt.revoked = trueWHERE rt.refreshToken = :token")
        void revokeByToken(@Param("token") String token);

        @Modifying
        @Transactional
        @Query("DELETE FROM RefreshToken t WHERE t.expiresAt < :cutoff")
        int deleteOldExpiredTokens(@Param("cutoff") Date cutoff);
}