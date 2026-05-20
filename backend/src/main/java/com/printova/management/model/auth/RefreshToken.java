package com.printova.management.model.auth;

import com.printova.management.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "refresh_token", length = 2048, unique = true, nullable = false)
    private String refreshToken;

    private boolean revoked;

    private Date issuedAt;

    private Date expiresAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}