package com.printova.management.service.auth;

import com.printova.management.repository.auth.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenCleanupService {

    private final RefreshTokenRepository repository;

    @Scheduled(cron = "0 0 3 * * *", zone = "Africa/Cairo")
    public void cleanup() {

        Instant retention =
                Instant.now().minus(60, ChronoUnit.DAYS);

        int deleted = repository.deleteOldExpiredTokens(
                Date.from(retention)
        );

        log.info("Deleted {} old refresh tokens", deleted);
    }
}