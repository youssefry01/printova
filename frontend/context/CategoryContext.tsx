"use client";

import { createContext, useContext, FC, ReactNode } from "react";
import api from "../api/axios";
import RootDataContext from "./RootDataContext";
import handleRequest from "../api/requestHandler";
import { Category } from "@/types";

interface CategoryContextType {
  categories: Category[] | null;
  setCategories: (categories: Category[] | null) => void;
  getAllCategories: () => Promise<unknown>;
  getCategoryById: (categoryId: string) => Promise<unknown>;
  addCategory: (categoryName: string, categoryDescription: string) => Promise<unknown>;
  updateCategory: (categoryId: string, categoryName: string, categoryDescription: string) => Promise<unknown>;
  deleteCategory: (categoryId: string) => Promise<unknown>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = useContext(RootDataContext);

  if (!contextValue) {
    throw new Error("CategoryProvider must be used within RootDataProvider");
  }

  const { categories, setCategories } = contextValue;

  const getAllCategories = async () => {
    return await handleRequest(() => api.get(`/api/category`));
  };

  const getCategoryById = async (categoryId: string) => {
    return await handleRequest(() => api.get(`/api/category/${categoryId}`));
  };
  
  const addCategory = async (categoryName: string, categoryDescription: string) => {
    return await handleRequest(() => api.post(`/api/category`, { categoryName, categoryDescription }));
  };

  const updateCategory = async (categoryId: string, categoryName: string, categoryDescription: string) => {
    return await handleRequest(() => api.put(`/api/category/${categoryId}`, { categoryName, categoryDescription }));
  };

  const removeCategory = async (categoryId: string) => {
    return await handleRequest(() => api.delete(`/api/category/${categoryId}`));
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory: removeCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
