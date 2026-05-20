import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import PartsResultBox from "../ResultBoxes/PartsResultBox";
import usePart from "@/hooks/usePart";

const PartsSection = () => {
  const { getAllParts, getPartById, addPart, updatePart, removePart } = usePart();

  // ---------- STATE ----------
  const [allPartsResult, setAllPartsResult] = useState<unknown | null>(null);

  const [partId, setPartId] = useState<string | undefined>(undefined);
  const [partResult, setPartResult] = useState<unknown | null>(null);

  const [addForm, setAddForm] = useState({ name: "", description: "", categoryId: "", supplierId: "", initialPrice: "" });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState({ id: "", name: "", description: "", categoryId: "", supplierId: "" });
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
    const res = await getAllParts();
    setAllPartsResult(res);
  };

  const handleGetById = async () => {
    const res = await getPartById(Number(partId));
    setPartResult(res);
  };

  const handleAdd = async () => {
    const res = await addPart(addForm.name, addForm.description, Number(addForm.categoryId), Number(addForm.supplierId), Number(addForm.initialPrice));
    setAddResult(res);
  };

  const handleUpdate = async () => {
    const res = await updatePart(Number(updateForm.id), updateForm.name, updateForm.description, Number(updateForm.categoryId), Number(updateForm.supplierId) );
    setUpdateResult(res);
  };

  const handleDelete = async () => {
    const res = await removePart(Number(deleteId));
    setDeleteResult(res);
  };

  return (
    <Section title="Parts">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Parts</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Parts</Button>

        <PartsResultBox  data={allPartsResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Part</h3>

        <FormGrid>
          <Input placeholder="Part ID" value={partId} onChange={(e) => setPartId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Part</Button>

        <PartsResultBox  data={partResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Part</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="name" placeholder="Part Name" value={addForm.name} onChange={handleAddChange} />
          <Input name="description" placeholder="Part Description" value={addForm.description} onChange={handleAddChange} />
          <Input name="categoryId" placeholder="Category ID" value={addForm.categoryId} onChange={handleAddChange} />
          <Input name="supplierId" placeholder="Supplier ID" value={addForm.supplierId} onChange={handleAddChange} />
          <Input name="initialPrice" placeholder="Initial Price" value={addForm.initialPrice} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Part</Button>

        <PartsResultBox  data={addResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Part</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Part ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="name" placeholder="Part Name" value={updateForm.name} onChange={handleUpdateChange} />
          <Input name="description" placeholder="Part Description" value={updateForm.description} onChange={handleUpdateChange} />
          <Input name="categoryId" placeholder="Category ID" value={updateForm.categoryId} onChange={handleUpdateChange} />
          <Input name="supplierId" placeholder="Supplier ID" value={updateForm.supplierId} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Part</Button>

        <PartsResultBox  data={updateResult} />
      </div>

      {/* ===== DELETE ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Delete Part</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input placeholder="Part ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleDelete} variant="danger" className="mb-2">Delete Part</Button>

        <PartsResultBox  data={deleteResult} />
      </div>

    </Section>
  );
};

export default PartsSection;