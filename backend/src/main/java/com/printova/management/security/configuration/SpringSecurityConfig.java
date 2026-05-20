package com.printova.management.security.configuration;

import com.printova.management.security.jwt.JwtAuthEntryPoint;
import com.printova.management.security.jwt.JwtAuthFilter;
import com.printova.management.service.auth.RefreshTokenService;
import com.printova.management.repository.auth.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import static com.printova.management.security.utility.SecurityUtils.extractRefreshToken;
import jakarta.servlet.http.Cookie;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SpringSecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final JwtAuthEntryPoint jwtAuthEntryPoint;
        private final RefreshTokenService refreshTokenService;
        private final RefreshTokenRepository refreshTokenRepository;

        @Bean
        public LogoutHandler logoutHandler() {
                return (request, response, authentication) -> {
                        String refreshToken = extractRefreshToken(request);
                        
                        if (refreshToken != null) {
                        try {
                                refreshTokenRepository.revokeByToken(refreshToken);
                        } catch (Exception e) {
                                // ignore
                        }
                        }

                        // Clear cookie regardless
                        Cookie cookie = new Cookie("refreshToken", "");
                        cookie.setHttpOnly(true);
                        cookie.setSecure(true);
                        cookie.setPath("/api/auth");
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);

                        SecurityContextHolder.clearContext();
                };
        }

    @Bean
    public SecurityFilterChain customSecurityFilterChain(HttpSecurity http) throws Exception {
        http    
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/", 
                                "/index.html", 
                                "/css/**", 
                                "/js/**", 
                                "/img/**",
                                "/favicon.ico",
                                "/webjars/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .addLogoutHandler(logoutHandler())
                        .logoutSuccessHandler((request, response, authentication) ->
                                SecurityContextHolder.clearContext())
                );

        return http.build();
    }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

                config.setAllowedOrigins(List.of(
                        "http://localhost:3000",
                        "https://printova-app.vercel.app"
                ));

                config.setAllowedMethods(java.util.List.of(
                        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
                ));

                config.setAllowedHeaders(java.util.List.of("*"));
                config.setAllowCredentials(true);

                org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                        new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }
}