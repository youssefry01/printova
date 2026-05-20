package com.printova.management.service.inventory.category;

import com.printova.management.dto.inventory.category.AddCategoryRequest;
import com.printova.management.dto.inventory.category.UpdateCategoryRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

public interface CategoryService {
    ResponseEntity<?> addCategory(AddCategoryRequest request);
    ResponseEntity<?> deleteCategory(@NonNull Integer categoryId);
    ResponseEntity<?> updateCategory(@NonNull Integer categoryId, UpdateCategoryRequest request);
    ResponseEntity<?> getAllCategories();
    ResponseEntity<?> getCategoryById(@NonNull Integer categoryId);
}