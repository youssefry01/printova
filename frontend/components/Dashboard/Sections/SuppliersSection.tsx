import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import useSupplier from "@/hooks/useSupplier";
import SupplierResultBox from "../ResultBoxes/SupplierResultBox";

type AddSupplierForm = {
  name: string;
  email: string;
  phone: string;
};

type UpdateSupplierForm = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const SuppliersSection = () => {
  const { getAllSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier } = useSupplier();

  // ---------- STATE ----------
  const [allSuppliersResult, setAllSuppliersResult] = useState<unknown | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [supplierResult, setSupplierResult] = useState<unknown | null>(null);

  const [addForm, setAddForm] = useState<AddSupplierForm>({ name: "", email: "", phone: "" });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState<UpdateSupplierForm>({ id: "", name: "", email: "", phone: "" });
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
    const res = await getAllSuppliers();
    setAllSuppliersResult(res);
  };

  const handleGetById = async () => {
    const res = await getSupplierById(supplierId);
    setSupplierResult(res);
  };

  const handleAdd = async () => {
    const res = await addSupplier(addForm.name, addForm.email, addForm.phone);
    setAddResult(res);
  };

  const handleUpdate = async () => {
    const res = await updateSupplier( updateForm.id, updateForm.name, updateForm.email, updateForm.phone );
    setUpdateResult(res);
  };

  const handleDelete = async () => {
    const res = await deleteSupplier(deleteId);
    setDeleteResult(res);
  };

  return (
    <Section title="Suppliers">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Suppliers</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Suppliers</Button>

        <SupplierResultBox data={allSuppliersResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Supplier</h3>

        <FormGrid>
          <Input placeholder="Supplier ID" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Supplier</Button>

        <SupplierResultBox data={supplierResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Supplier</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="name" placeholder="Supplier Name" value={addForm.name} onChange={handleAddChange} />
          <Input name="email" placeholder="Supplier Email" value={addForm.email} onChange={handleAddChange} />
          <Input name="phone" placeholder="Supplier Phone" value={addForm.phone} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Supplier</Button>

        <SupplierResultBox data={addResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Supplier</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Supplier ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="name" placeholder="Supplier Name" value={updateForm.name} onChange={handleUpdateChange} />
          <Input name="email" placeholder="Supplier Email" value={updateForm.email} onChange={handleUpdateChange} />
          <Input name="phone" placeholder="Supplier Phone" value={updateForm.phone} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Supplier</Button>

        <SupplierResultBox data={updateResult} />
      </div>

      {/* ===== DELETE ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Delete Supplier</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input placeholder="Supplier ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleDelete} variant="danger" className="mb-2">Delete Supplier</Button>

        <SupplierResultBox data={deleteResult} />
      </div>

    </Section>
  );
};

export default SuppliersSection;