package com.printova.management.dto.inventory.category;

import com.printova.management.model.inventory.Category;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class CategoryDTOMapper implements Function<Category, CategoryDTO> {

    @Override
    public CategoryDTO apply(Category category) {
        return new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getCategoryDescription()
        );
    }
}