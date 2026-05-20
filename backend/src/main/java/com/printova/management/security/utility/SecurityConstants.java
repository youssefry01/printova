package com.printova.management.security.utility;
import java.time.Duration;

public class SecurityConstants {
    public static final long JWT_ACCESS_EXPIRATION =
            Duration.ofMinutes(15).toMillis();

    public static final long JWT_REFRESH_EXPIRATION =
            Duration.ofDays(30).toMillis();
}