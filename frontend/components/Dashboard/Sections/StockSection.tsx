import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import useStock from "@/hooks/useStock";
import StockResultBox from "../ResultBoxes/StockResultBox";

type UpdateStockForm = {
  id: string;
  quantity: string;
};

type AdjustStockForm = {
  id: string;
  quantity: string;
};

const StockSection = () => {
  const { getAllStock, getStockByPartId, updatePartStock, adjustPartStock } = useStock();

  // ---------- STATE ----------
  const [allStockResult, setAllStockResult] = useState<unknown | null>(null);

  const [partId, setPartId] = useState("");
  const [stockResult, setStockResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState<UpdateStockForm>({ id: "", quantity: "" });
  const [updateResult, setUpdateResult] = useState<unknown | null>(null);

  const [adjustForm, setAdjustForm] = useState<AdjustStockForm>({ id: "", quantity: "" });
  const [adjustResult, setAdjustResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleAdjustChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustForm({ ...adjustForm, [e.target.name]: e.target.value });
  };

  const handleGetAll = async () => {
    const res = await getAllStock();
    setAllStockResult(res);
  };

  const handleGetByPartId = async () => {
    const res = await getStockByPartId(partId);
    setStockResult(res);
  };

  const handleUpdate = async () => {
    const res = await updatePartStock( updateForm.id, updateForm.quantity );
    setUpdateResult(res);
  };
  const handleAdjust = async () => {
    const res = await adjustPartStock( adjustForm.id, adjustForm.quantity );
    setAdjustResult(res);
  };

  return (
    <Section title="Stock">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Stock</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Stock</Button>

        <StockResultBox data={allStockResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Stock</h3>

        <FormGrid>
          <Input placeholder="Part ID" value={partId} onChange={(e) => setPartId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetByPartId} className="mb-2">Get Stock</Button>

        <StockResultBox data={stockResult} />
      </div>

      {/* ===== UPDATE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update Stock</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Part ID" value={updateForm.id} onChange={handleUpdateChange} />
          <Input name="quantity" placeholder="Stock Quantity" value={updateForm.quantity} onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdate} className="mb-2">Update Stock</Button>

        <StockResultBox data={updateResult} />
      </div>

      {/* ===== ADJUST ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Adjust Stock</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin, Manager</p>

        <FormGrid>
          <Input name="id" placeholder="Part ID" value={adjustForm.id} onChange={handleAdjustChange} />
          <Input name="quantity" placeholder="Stock Quantity" value={adjustForm.quantity} onChange={handleAdjustChange} />
        </FormGrid>

        <Button onClick={handleAdjust} className="mb-2">Adjust Stock</Button>

        <StockResultBox data={adjustResult} />
      </div>

    </Section>
  );
};

export default StockSection;