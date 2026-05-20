package com.printova.management.dto.inventory.category;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddCategoryRequest {
    @NotBlank(message = "CategoryName is required")
    private String categoryName;

    @NotBlank(message = "CategoryDescription is required")
    private String categoryDescription;
}