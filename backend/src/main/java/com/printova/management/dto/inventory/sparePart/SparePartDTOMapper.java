package com.printova.management.dto.inventory.sparePart;

import com.printova.management.model.inventory.SparePart;
import com.printova.management.model.inventory.PartPrice;
import com.printova.management.model.inventory.Stock;
import com.printova.management.repository.inventory.PartPriceRepository;
import com.printova.management.repository.inventory.StockRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.function.Function;

@Component
public class SparePartDTOMapper implements Function<SparePart, SparePartDTO> {

    private final PartPriceRepository partPricesRepository;
    private final StockRepository stockRepository;

    public SparePartDTOMapper(PartPriceRepository partPricesRepository, StockRepository stockRepository) {
        this.partPricesRepository = partPricesRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public SparePartDTO apply(SparePart part) {

        Optional<PartPrice> latestPrice = partPricesRepository.findTopByPartPartIdOrderByValidFromDesc(part.getPartId());

        Optional<Stock> stock = stockRepository.findByPartPartId(part.getPartId());

        return SparePartDTO.builder()
                .partId(part.getPartId())
                .partName(part.getPartName())
                .partDescription(part.getPartDescription())
                .categoryName(part.getCategory().getCategoryName())
                .supplierName(part.getSupplier().getSupplierName())
                .currentPrice(latestPrice.map(PartPrice::getPrice).orElse(null))
                .stockQuantity(stock.map(Stock::getStockQuantity).orElse(0))
                .build();
    }
}