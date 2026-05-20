package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.PartPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PartPriceRepository extends JpaRepository<PartPrice, Integer> {
    Optional<PartPrice> findByPriceId(Integer priceId);
    Optional<PartPrice> findByPartPartId(Integer partId);
    Optional<PartPrice> findTopByPartPartIdOrderByValidFromDesc(Integer partId);
    List<PartPrice> findByPartPartIdOrderByValidFromDesc(Integer partId);
}

