package com.printova.management.service.inventory.category;

import com.printova.management.dto.inventory.category.AddCategoryRequest;
import com.printova.management.dto.inventory.category.CategoryDTO;
import com.printova.management.dto.inventory.category.CategoryDTOMapper;
import com.printova.management.dto.inventory.category.UpdateCategoryRequest;
import com.printova.management.model.inventory.Category;
import com.printova.management.repository.inventory.CategoryRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryDTOMapper categoryDTOMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryDTOMapper categoryDTOMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryDTOMapper = categoryDTOMapper;
    }

    @Override
    public ResponseEntity<?> addCategory(AddCategoryRequest request) {
        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .categoryDescription(request.getCategoryDescription())
                .build();
        if (category != null) {
            categoryRepository.save(category);
            return ResponseEntity.ok(categoryDTOMapper.apply(category));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to create category"));
    }

    @Override
    public ResponseEntity<?> deleteCategory(Integer categoryId) {
        if (categoryId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Category ID cannot be null"));
        }

        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category != null) {
            categoryRepository.delete(category);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        }
        return ResponseEntity.status(400).body(Map.of("error", "Failed to delete category"));
    }

    @Override
    public ResponseEntity<?> updateCategory(Integer categoryId, UpdateCategoryRequest request) {
        if (categoryId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Category ID cannot be null"));
        }
        
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Category not found"));
        }
        if (request.getCategoryName() != null && !request.getCategoryName().isEmpty()) {
            category.setCategoryName(request.getCategoryName());
        }
        if (request.getCategoryDescription() != null && !request.getCategoryDescription().isEmpty()) {
            category.setCategoryDescription(request.getCategoryDescription());
        }

        categoryRepository.save(category);
        return ResponseEntity.ok(categoryDTOMapper.apply(category));
    }

    @Override
    public ResponseEntity<?> getAllCategories() {
        List<CategoryDTO> categories = categoryRepository.findAll().stream()
                .map(categoryDTOMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @Override
    public ResponseEntity<?> getCategoryById(Integer categoryId) {
        if (categoryId == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Category ID cannot be null"));
        }
        
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Category not found"));
        }
        return ResponseEntity.ok(categoryDTOMapper.apply(category));
    }
}