package com.printova.management.security.configuration;

import com.printova.management.model.inventory.ServiceFee;
import com.printova.management.model.maintenance.MaintenanceStatus;
import com.printova.management.model.order.OrderStatus;
import com.printova.management.model.payment.PaymentMethod;
import com.printova.management.model.payment.PaymentStatus;
import com.printova.management.model.inventory.Category;
import com.printova.management.model.inventory.PartPrice;
import com.printova.management.model.inventory.Supplier;
import com.printova.management.model.inventory.SparePart;
import com.printova.management.model.inventory.Stock;
import com.printova.management.repository.inventory.ServiceFeeRepository;
import com.printova.management.repository.maintenance.MaintenanceStatusRepository;
import com.printova.management.repository.order.OrderStatusRepository;
import com.printova.management.repository.payment.PaymentMethodRepository;
import com.printova.management.repository.payment.PaymentStatusRepository;
import com.printova.management.repository.inventory.CategoryRepository;
import com.printova.management.repository.inventory.SupplierRepository;
import com.printova.management.repository.inventory.SparePartRepository;
import com.printova.management.repository.inventory.PartPriceRepository;
import com.printova.management.repository.inventory.StockRepository;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class SystemDataInitializer implements CommandLineRunner {

    private final ServiceFeeRepository serviceFeeRepository;
    private final MaintenanceStatusRepository maintenanceStatusRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final SparePartRepository sparePartRepository;
    private final PartPriceRepository partPriceRepository;
    private final StockRepository stockRepository;

    @Override
    public void run(String... args) {

        initializeServices();
        initializeMaintenanceStatuses();
        initializeOrderStatuses();
        initializePaymentMethods();
        initializePaymentStatuses();
        initializeCategories();
        initializeSuppliers();
        initializeParts();
    }

    // ================= SERVICES =================

    private void initializeServices() {
        createServiceIfNotExists("DELIVERY", 15.0);
        createServiceIfNotExists("MAINTENANCE", 100.0);
    }

    private void createServiceIfNotExists(String name, Double price) {

        serviceFeeRepository.findByServiceNameIgnoreCase(name)
                .orElseGet(() -> {
                    ServiceFee service = ServiceFee.builder()
                            .serviceName(name)
                            .servicePrice(price)
                            .build();

                    return serviceFeeRepository.save(service);
                });
    }

    // ================= MAINTENANCE STATUS =================

    private void initializeMaintenanceStatuses() {
        createMaintenanceStatusIfNotExists("Scheduled");
        createMaintenanceStatusIfNotExists("In Progress");
        createMaintenanceStatusIfNotExists("Completed");
        createMaintenanceStatusIfNotExists("Cancelled");
    }

    private void createMaintenanceStatusIfNotExists(String status) {

        maintenanceStatusRepository.findByMaintenanceStatusIgnoreCase(status)
                .orElseGet(() -> {
                    MaintenanceStatus newStatus = MaintenanceStatus.builder()
                            .maintenanceStatus(status)
                            .build();

                    return maintenanceStatusRepository.save(newStatus);
                });
    }

    // ================= ORDER STATUS =================

    private void initializeOrderStatuses() {

        createOrderStatusIfNotExists("Pending");
        createOrderStatusIfNotExists("Paid");
        createOrderStatusIfNotExists("Completed");
        createOrderStatusIfNotExists("Cancelled");
    }

    private void createOrderStatusIfNotExists(String status) {

        orderStatusRepository.findByOrderStatusIgnoreCase(status)
                .orElseGet(() -> {
                    OrderStatus newStatus = OrderStatus.builder()
                            .orderStatus(status)
                            .build();

                    return orderStatusRepository.save(newStatus);
                });
    }

    // ================= PAYMENT METHOD =================

    private void initializePaymentMethods() {

        createPaymentMethodIfNotExists("CARD", "Card");
        createPaymentMethodIfNotExists("COD", "Cash on Delivery");
    }

    private void createPaymentMethodIfNotExists(String code, String name) {

        paymentMethodRepository.findByPaymentMethodCodeIgnoreCase(code)
                .orElseGet(() -> {
                    PaymentMethod method = PaymentMethod.builder()
                            .paymentMethodCode(code)
                            .paymentMethodName(name)
                            .build();

                    return paymentMethodRepository.save(method);
                });
    }

    // ================= PAYMENT STATUS =================

    private void initializePaymentStatuses() {

        createPaymentStatusIfNotExists("Pending");
        createPaymentStatusIfNotExists("Completed");
        createPaymentStatusIfNotExists("Failed");
    }

    private void createPaymentStatusIfNotExists(String status) {

        paymentStatusRepository.findByPaymentStatusIgnoreCase(status)
                .orElseGet(() -> {
                    PaymentStatus newStatus = PaymentStatus.builder()
                            .paymentStatus(status)
                            .build();

                    return paymentStatusRepository.save(newStatus);
                });
    }

    // ================= CATEGORIES =================
    private void initializeCategories() {
        createCategoryIfNotExists("Toner & Ink");
        createCategoryIfNotExists("Fuser Assembly");
        createCategoryIfNotExists("Maintenance Kit");
        createCategoryIfNotExists("Rollers");
        createCategoryIfNotExists("Drum Unit");
        createCategoryIfNotExists("Formatter & Boards");
    }

    private void createCategoryIfNotExists(String category) {

        categoryRepository.findByCategoryNameIgnoreCase(category)
                .orElseGet(() -> {
                    Category newCategory = Category.builder()
                            .categoryName(category)
                            .categoryDescription("")
                            .build();

                    return categoryRepository.save(newCategory);
                });
    }

    // ================= SUPPLIERS =================
    private void initializeSuppliers() {
        createSupplierIfNotExists("HP Authorized Distributors", "sales@hpdist.com", "+1-800-111-2222");
        createSupplierIfNotExists("Canon Parts Supply", "contact@canonparts.com", "+1-800-333-4444");
        createSupplierIfNotExists("Epson Components Ltd", "orders@epsonparts.com", "+1-800-555-6666");
        createSupplierIfNotExists("Universal Printer Parts", "info@uniprintparts.com", "+1-800-777-8888");
    }

    private void createSupplierIfNotExists(String supplierName, String supplierEmail, String supplierPhone) {

        supplierRepository.findBySupplierEmailIgnoreCase(supplierEmail)
                .orElseGet(() -> {
                    Supplier newSupplier = Supplier.builder()
                        .supplierName(supplierName)
                        .supplierEmail(supplierEmail)
                        .supplierPhone(supplierPhone)
                        .build();

                    return supplierRepository.save(newSupplier);
                });
    }

    // ================= PARTS =================
    private void initializeParts() {
        createPartIfNotExists("HP 12A Toner Cartridge", "Black toner cartridge for HP LaserJet 1010/1020 series", "Toner & Ink", "sales@hpdist.com", new BigDecimal("1850.00"), 52);
        createPartIfNotExists("Canon IR2200 Fuser Assembly", "Complete fuser unit for Canon IR2200 printer", "Fuser Assembly", "contact@canonparts.com", new BigDecimal("7800.00"), 0);
        createPartIfNotExists("Epson L360 Maintenance Box", "Waste ink maintenance box for Epson L360", "Maintenance Kit", "orders@epsonparts.com", new BigDecimal("950.00"), 8);
        createPartIfNotExists("HP Pickup Roller RL1-0540", "Paper pickup roller for HP LaserJet P1005", "Rollers", "sales@hpdist.com", new BigDecimal("320.00"), 35);
        createPartIfNotExists("Canon IR2520 Drum Unit", "Drum unit compatible with Canon IR2520", "Drum Unit", "contact@canonparts.com", new BigDecimal("4200.00"), 26);
        createPartIfNotExists("HP Formatter Board CC388-60001", "Main formatter board for HP LaserJet P1102", "Formatter & Boards", "sales@hpdist.com", new BigDecimal("5200.00"), 0);
        createPartIfNotExists("Universal Pressure Roller", "Pressure roller compatible with multiple laser printers", "Rollers", "info@uniprintparts.com", new BigDecimal("480.00"), 46);
        createPartIfNotExists("Epson L805 Printhead", "Original printhead for Epson L805 inkjet printer", "Formatter & Boards", "orders@epsonparts.com", new BigDecimal("6900.00"), 60);
    }

    private void createPartIfNotExists(String partName, String partDescription, String categoryName, String supplierEmail, BigDecimal initialPrice, Integer initialStock) {

        sparePartRepository.findByPartNameIgnoreCase(partName)
                .orElseGet(() -> {
                    Category category = categoryRepository.findByCategoryNameIgnoreCase(categoryName).orElse(null);
                    if (category == null) {
                        throw new RuntimeException("Category with name " + categoryName + " not found");
                    }
                    Supplier supplier = supplierRepository.findBySupplierEmailIgnoreCase(supplierEmail).orElse(null);
                    if (supplier == null) {
                        throw new RuntimeException("Supplier with email " + supplierEmail + " not found");
                    }

                    SparePart newPart = SparePart.builder()
                        .partName(partName)
                        .partDescription(partDescription)
                        .category(category)
                        .supplier(supplier)
                        .build();

                    SparePart savedPart = sparePartRepository.save(newPart);

                    PartPrice price = PartPrice.builder()
                        .part(savedPart)
                        .price(initialPrice)
                        .validFrom(LocalDateTime.now())
                        .build();

                    partPriceRepository.save(price);

                    Stock stock = Stock.builder()
                            .part(savedPart)
                            .stockQuantity(initialStock)
                            .build();

                    stockRepository.save(stock);

                    return savedPart;
                });
    }
}