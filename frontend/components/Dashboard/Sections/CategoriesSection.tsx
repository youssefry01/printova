import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import CategoryResultBox from "../ResultBoxes/CategoryResultBox";
import useCategory from "@/hooks/useCategory";

const CategoriesSection = () => {
  const { getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = useCategory();

  // ---------- STATE ----------
  const [allCategoriesResult, setAllCategoriesResult] = useState<unknown | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [categoryResult, setCategoryResult] = useState<unknown | null>(null);

  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState({ id: "", name: "", description: "" });
  const [updateResult, setUpdateResult] = useState<unknown | null>(null);

  const [deleteId, setDeleteId] = useState("");
  const [deleteResult, setDeleteResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleGetAll = async () => {
    const res = await getAllCategories();
    setAllCategoriesResult(res);
  };

  const handleGetById = async () => {
    const res = await getCategoryById(categoryId);
    setCategoryResult(res);
  };

  const handleAdd = async () => {
    const res = await addCategory(addForm.name, addForm.description);
    setAddResult(res);
  };

  const handleUpdate = async () => {
    const res = await updateCategory( updateForm.id, updateForm.name, updateForm.description );
    setUpdateResult(res);
  };

  const handleDelete = async () => {
    const res = await deleteCategory(deleteId);
    setDeleteResult(res);
  };

  return (
    <Section title="Categories">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Categories</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Categories</Button>

        <CategoryResultBox data={allCategoriesResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Category</h3>

        <FormGrid>
          <Input placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Category</Button>

        <CategoryResultBox data={categoryResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Category</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="name" placeholder="Category Name" value={addForm.name} onChange={handleAddChange} />
          <Input name="description" placeholder="Category Description" value={addForm.description} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Category</Button>

        <CategoryResultBox data={addResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Category</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Category ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="name" placeholder="Category Name" value={updateForm.name} onChange={handleUpdateChange} />
          <Input name="description" placeholder="Category Description" value={updateForm.description} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Category</Button>

        <CategoryResultBox data={updateResult} />
      </div>

      {/* ===== DELETE ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Delete Category</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input placeholder="Category ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleDelete} variant="danger" className="mb-2">Delete Category</Button>

        <CategoryResultBox data={deleteResult} />
      </div>

    </Section>
  );
};

export default CategoriesSection;