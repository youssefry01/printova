package com.printova.management.repository.inventory;

import com.printova.management.model.inventory.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByCategoryId(@NonNull Integer categoryId);
    Optional<Category> findByCategoryNameIgnoreCase(@NonNull String categoryName);
}
