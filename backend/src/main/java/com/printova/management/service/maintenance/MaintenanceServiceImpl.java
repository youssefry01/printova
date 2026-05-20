package com.printova.management.service.maintenance;

import com.printova.management.dto.maintenance.*;
import com.printova.management.model.inventory.ServiceFee;
import com.printova.management.model.maintenance.*;
import com.printova.management.model.payment.Payment;
import com.printova.management.model.payment.PaymentMethod;
import com.printova.management.model.payment.PaymentStatus;
import com.printova.management.model.user.User;
import com.printova.management.model.user.Role;
import com.printova.management.repository.inventory.ServiceFeeRepository;
import com.printova.management.repository.maintenance.MaintenanceRepository;
import com.printova.management.repository.maintenance.MaintenanceStatusRepository;
import com.printova.management.repository.payment.PaymentMethodRepository;
import com.printova.management.repository.payment.PaymentRepository;
import com.printova.management.repository.payment.PaymentStatusRepository;
import com.printova.management.repository.user.RoleRepository;
import com.printova.management.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

        private final MaintenanceRepository maintenanceRepository;
        private final UserRepository userRepository;
        private final PaymentMethodRepository paymentMethodRepository;
        private final PaymentStatusRepository paymentStatusRepository;
        private final PaymentRepository paymentRepository;
        private final RoleRepository roleRepository;
        private final ServiceFeeRepository serviceFeeRepository;
        private final MaintenanceStatusRepository maintenanceStatusRepository;

        private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        @Override
        @Transactional
        public ResponseEntity<?> createMaintenance(CreateMaintenanceRequest request) {

                if (request.getAddress() == null || request.getAddress().isBlank()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Address is required"));
                }

                if (request.getDescription() == null || request.getDescription().isBlank()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Description is required"));
                }

                if (request.getDate() == null) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Date is required"));
                }

                validateMaintenanceDate(request.getDate());

                User customer = getCurrentUser();

                // =========================
                // Get COD Payment Method
                // =========================
                PaymentMethod codMethod = paymentMethodRepository
                        .findByPaymentMethodCodeIgnoreCase("COD")
                        .orElseThrow(() -> new RuntimeException("COD payment method not found"));

                // =========================
                // Get MAINTENANCE Fee
                // =========================
                ServiceFee maintenanceFee = serviceFeeRepository
                        .findByServiceNameIgnoreCase("MAINTENANCE")
                        .orElseThrow(() -> new RuntimeException("Maintenance service fee not configured"));

                BigDecimal servicePrice = BigDecimal.valueOf(maintenanceFee.getServicePrice());

                // =========================
                // Get Scheduled status
                // =========================
                MaintenanceStatus scheduledStatus = maintenanceStatusRepository
                        .findByMaintenanceStatusIgnoreCase("SCHEDULED")
                        .orElseThrow(() -> new RuntimeException("Scheduled maintenance status not found"));

                // =========================
                // Select Technician User with no maintenance at same time or 2 hours before/after
                // =========================
                Role technicianRole = roleRepository
                        .findByRoleNameIgnoreCase("TECHNICIAN")
                        .orElseThrow(() -> new RuntimeException("Technician role not found"));

                List<User> technicianUsers = userRepository.findByRolesContaining(technicianRole);

                LocalDateTime requestedDate = request.getDate();
                LocalDateTime startWindow = requestedDate.minusHours(2);
                LocalDateTime endWindow = requestedDate.plusHours(2);

                User availableTechnician = technicianUsers.stream()
                        .filter(user ->
                                maintenanceRepository.countConflictingMaintenances(
                                user, startWindow, endWindow) == 0)
                        .min(Comparator.comparing(user ->
                                maintenanceRepository.countActiveByTechnician(user)))
                        .orElseThrow(() ->
                                new RuntimeException("No technician available for this time slot"));

                // =========================
                // Create Maintenance
                // =========================
                Maintenance maintenance = Maintenance.builder()
                        .customer(customer)
                        .technicianUser(availableTechnician)
                        .paymentMethod(codMethod)
                        .maintenanceStatus(scheduledStatus)
                        .maintAddress(request.getAddress())
                        .maintDate(request.getDate())
                        .maintDescription(request.getDescription())
                        .serviceId(maintenanceFee.getServiceId())
                        .servicePrice(maintenanceFee.getServicePrice())
                        .build();

                maintenance.setTotalAmount(servicePrice);

                // =========================
                // Create PENDING Payment record
                // =========================
                PaymentStatus pendingPaymentStatus = paymentStatusRepository
                        .findByPaymentStatusIgnoreCase("PENDING")
                        .orElseThrow(() -> new RuntimeException("Pending payment status not configured"));

                Payment payment = Payment.builder()
                        .maintenance(maintenance)
                        .paymentMethod(codMethod)
                        .paymentAmount(maintenance.getTotalAmount())
                        .paymentStatus(pendingPaymentStatus)
                        .build();

                if (payment == null) {
                        throw new RuntimeException("Failed to create payment");
                }

                maintenanceRepository.save(maintenance);
                paymentRepository.save(payment);

                return ResponseEntity.ok(buildMaintenanceResponse(maintenance));
        }

        private MaintenanceResponse buildMaintenanceResponse(Maintenance maintenance) {


        return MaintenanceResponse.builder()
                .maintenanceId(maintenance.getMaintenanceId())
                .customerId(maintenance.getCustomer().getUserId())
                .technicianUserId(maintenance.getTechnicianUser().getUserId())
                .paymentMethod(maintenance.getPaymentMethod().getPaymentMethodCode())
                .status(maintenance.getMaintenanceStatus())
                .totalAmount(maintenance.getTotalAmount())
                .serviceId(maintenance.getServiceId())
                .servicePrice(maintenance.getServicePrice())
                .address(maintenance.getMaintAddress())
                .description(maintenance.getMaintDescription())
                .date(maintenance.getMaintDate())
                .completedAt(maintenance.getCompletedAt())
                .createdAt(maintenance.getCreatedAt())
                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public List<MaintenanceResponse> getMyMaintenances() {
                User customer = getCurrentUser();

                List<Maintenance> maintenances = maintenanceRepository
                        .findByCustomerOrderByCreatedAtDesc(customer);

                return maintenances.stream()
                        .map(this::buildMaintenanceResponse)
                        .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public MaintenanceResponse getMyMaintenanceById(Long maintenanceId) {

                if (maintenanceId == null) {
                        throw new RuntimeException("Maintenance ID cannot be null");
                }

                User currentUser = getCurrentUser();

                Maintenance maintenance = maintenanceRepository
                        .findByMaintenanceIdAndCustomer(maintenanceId, currentUser)
                        .orElseThrow(() -> new RuntimeException("Maintenance not found"));

                return buildMaintenanceResponse(maintenance);
        }

        @Override
        @Transactional(readOnly = true)
        public List<MaintenanceResponse> getTechnicianMaintenancesByStatus(String status) {

        User technicianUser = getCurrentUser();

        if (status == null || status.isBlank()) {
                throw new IllegalArgumentException("Status must not be empty");
        }

        MaintenanceStatus maintenanceStatus = maintenanceStatusRepository
                .findByMaintenanceStatusIgnoreCase(status)
                .orElseThrow(() ->
                        new IllegalArgumentException("Maintenance status not found: " + status));

        List<Maintenance> maintenances =
                maintenanceRepository.findByTechnicianUserAndMaintenanceStatus(
                        technicianUser,
                        maintenanceStatus
                );

        return maintenances.stream()
                .map(this::buildMaintenanceResponse)
                .toList();
        }

        @Override
        @Transactional
        public MaintenanceResponse completeMaintenance(Long maintenanceId) {
                User deliveryUser = getCurrentUser();

                if (maintenanceId == null) {
                        throw new RuntimeException("Maintenance ID cannot be null");
                }

                Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                        .orElseThrow(() -> new RuntimeException("Maintenance not found"));

                // Ensure only assigned delivery user can update
                if (!maintenance.getTechnicianUser().getUserId().equals(deliveryUser.getUserId())) {
                throw new RuntimeException("You are not authorized to update this maintenance");
                }

                // Do not allow if maintenance is cancelled
                if ("CANCELLED".equalsIgnoreCase(maintenance.getMaintenanceStatus().getMaintenanceStatus())) {
                throw new RuntimeException("Cannot complete a cancelled maintenance");
                }

                // Only allow completion if current status is Scheduled
                if (!"Scheduled".equalsIgnoreCase(maintenance.getMaintenanceStatus().getMaintenanceStatus())) {
                throw new RuntimeException("Only scheduled maintenances can be completed");
                }

                if (java.time.LocalDateTime.now().isBefore(maintenance.getMaintDate())) {
                        throw new RuntimeException("Cannot complete maintenance before its scheduled date/time");
                }

                MaintenanceStatus completedStatus = maintenanceStatusRepository
                        .findByMaintenanceStatusIgnoreCase("COMPLETED")
                        .orElseThrow(() -> new RuntimeException("Completed maintenance status not configured"));

                maintenance.setMaintenanceStatus(completedStatus);
                maintenance.setCompletedAt(java.time.LocalDateTime.now());
                maintenanceRepository.save(maintenance);

                // =========================
                // Update Payment to COMPLETED
                // =========================
                Payment payment = paymentRepository.findByMaintenance(maintenance)
                        .orElseThrow(() -> new RuntimeException("Payment record not found for maintenance"));

                PaymentStatus completedPaymentStatus = paymentStatusRepository
                        .findByPaymentStatusIgnoreCase("COMPLETED")
                        .orElseThrow(() -> new RuntimeException("Completed payment status not configured"));

                payment.setPaymentStatus(completedPaymentStatus);
                paymentRepository.save(payment);

                return buildMaintenanceResponse(maintenance);
        }

        private void validateMaintenanceDate(LocalDateTime dateTime) {

                if (dateTime.isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("Maintenance date cannot be in the past");
                }

                int hour = dateTime.getHour();
                int minute = dateTime.getMinute();
                DayOfWeek day = dateTime.getDayOfWeek();

                if (hour < 9 || hour > 16) {
                        throw new RuntimeException("Maintenance must be between 09:00 and 16:00");
                }

                if (minute != 0) {
                        throw new RuntimeException("Maintenance must be scheduled on the hour");
                }

                if (day == DayOfWeek.FRIDAY || day == DayOfWeek.SATURDAY) {
                        throw new RuntimeException("Maintenance cannot be on Friday or Saturday");
                }

                LocalDateTime now = LocalDateTime.now();
                boolean isToday = dateTime.toLocalDate().isEqual(now.toLocalDate());
                boolean isBefore9AM = now.toLocalTime().isBefore(java.time.LocalTime.of(9, 0));

                if (isToday && !isBefore9AM) {
                        throw new RuntimeException("Same-day maintenance booking is not allowed after 09:00 AM");
                }
        }
}