package com.printova.management.repository.maintenance;

import com.printova.management.model.maintenance.Maintenance;
import com.printova.management.model.user.User;
import com.printova.management.model.maintenance.MaintenanceStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByCustomer_UserId(Long userId);
    int countByTechnicianUserAndMaintenanceStatus(User technicianUser, MaintenanceStatus maintenanceStatus);
    

    @Query("SELECT o.technicianUser, COUNT(o) FROM Maintenance o WHERE o.technicianUser IS NOT NULL AND o.maintenanceStatus = :status GROUP BY o.technicianUser ORDER BY COUNT(o) ASC")
    List<Object[]> countActiveMaintenancesByTechnicianUser(@Param("status") MaintenanceStatus maintenanceStatus);

    Optional<Maintenance> findByMaintenanceIdAndCustomer(Long maintenanceId, User customer);
    List<Maintenance> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Maintenance> findByTechnicianUserOrderByCreatedAtDesc(User technicianUser);
    List<Maintenance> findByTechnicianUserAndMaintenanceStatus(User technicianUser, MaintenanceStatus status);
    
    @Query("""
        SELECT COUNT(m)
        FROM Maintenance m
        WHERE m.technicianUser = :technician
        AND m.maintenanceStatus.maintenanceStatus <> 'CANCELLED'
    """)
    long countActiveByTechnician(@Param("technician") User technician);

    @Query("""
        SELECT COUNT(m)
        FROM Maintenance m
        WHERE m.technicianUser = :technician
        AND m.maintDate BETWEEN :start AND :end
        AND m.maintenanceStatus.maintenanceStatus <> 'CANCELLED'
    """)
    long countConflictingMaintenances(
            @Param("technician") User technician,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}