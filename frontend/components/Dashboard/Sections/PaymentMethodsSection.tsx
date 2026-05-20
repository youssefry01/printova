import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import PaymentMethodResultBox from "../ResultBoxes/PaymentMethodResultBox";
import usePaymentMethod from "@/hooks/usePaymentMethod";

const PaymentMethodsSection = () => {
  const { getAllPaymentMethods, getPaymentMethodById, addPaymentMethod, updatePaymentMethod, removePaymentMethod } = usePaymentMethod();

  // ---------- STATE ----------
  const [allPaymentMethodsResult, setAllPaymentMethodsResult] = useState<unknown | null>(null);

  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentMethodResult, setPaymentMethodResult] = useState<unknown | null>(null);

  const [addForm, setAddForm] = useState({ code: "", name: "" });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState({ id: "", code: "", name: "" });
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
    const res = await getAllPaymentMethods();
    setAllPaymentMethodsResult(res);
  };

  const handleGetById = async () => {
    const res = await getPaymentMethodById(paymentMethodId);
    setPaymentMethodResult(res);
  };

  const handleAdd = async () => {
    const res = await addPaymentMethod(addForm.code, addForm.name);
    setAddResult(res);
  };

  const handleUpdate = async () => {
    const res = await updatePaymentMethod( updateForm.id, updateForm.code, updateForm.name );
    setUpdateResult(res);
  };

  const handleDelete = async () => {
    const res = await removePaymentMethod(deleteId);
    setDeleteResult(res);
  };

  return (
    <Section title="Payment Methods">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Payment Methods</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Payment Methods</Button>

        <PaymentMethodResultBox data={allPaymentMethodsResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Payment Method</h3>

        <FormGrid>
          <Input placeholder="Payment Method ID" value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Payment Method</Button>

        <PaymentMethodResultBox data={paymentMethodResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Payment Method</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="code" placeholder="Payment Method Code" value={addForm.code} onChange={handleAddChange} />
          <Input name="name" placeholder="Payment Method Name" value={addForm.name} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Payment Method</Button>

        <PaymentMethodResultBox data={addResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Payment Method</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Payment Method ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="code" placeholder="Payment Method Code" value={updateForm.code} onChange={handleUpdateChange} />
          <Input name="name" placeholder="Payment Method Name" value={updateForm.name} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Payment Method</Button>

        <PaymentMethodResultBox data={updateResult} />
      </div>

      {/* ===== DELETE ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Delete Payment Method</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input placeholder="Payment Method ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleDelete} variant="danger" className="mb-2">Delete Payment Method</Button>

        <PaymentMethodResultBox data={deleteResult} />
      </div>

    </Section>
  );
};

export default PaymentMethodsSection;