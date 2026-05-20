import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import PartPricesResultBox from "../ResultBoxes/PartPricesResultBox";
import usePartPrice from "@/hooks/usePartPrice";

const PartPricesSection = () => {
  const { getAllPrices, getPartPrices, getLatestPartPrice, addPartPrice } = usePartPrice();

  // ---------- STATE ----------
  const [allPartPricesResult, setAllPartPricesResult] = useState<unknown | null>(null);

  const [partPriceId, setPartPriceId] = useState<string | undefined>(undefined);
  const [partPricesResult, setPartPricesResult] = useState<unknown | null>(null);

  const [latestPartPriceId, setLatestPartPriceId] = useState<string | undefined>(undefined);
  const [latestPartPriceResult, setLatestPartPriceResult] = useState<unknown | null>(null);
  const [addForm, setAddForm] = useState({ id: "", price: "" } as { id: string; price: string });
  const [addResult, setAddResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleGetAll = async () => {
    const res = await getAllPrices();
    setAllPartPricesResult(res);
  };

  const handleGetPartPrices = async () => {
    if (partPriceId === undefined) return;
    const res = await getPartPrices(partPriceId);
    setPartPricesResult(res);
  };

  const handleGetLatestPartPrice = async () => {
    if (latestPartPriceId === undefined) return;
    const res = await getLatestPartPrice(latestPartPriceId);
    setLatestPartPriceResult(res);
  };

  const handleAdd = async () => {
    const res = await addPartPrice(addForm.id, addForm.price);
    setAddResult(res);
  };

  return (
    <Section title="Part Prices">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Part Prices</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Part Prices</Button>

        <PartPricesResultBox data={allPartPricesResult} />
      </div>

      {/* ===== GET BY PART ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Part Price</h3>

        <FormGrid>
          <Input placeholder="Part ID" value={partPriceId} onChange={(e) => setPartPriceId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetPartPrices} className="mb-2">Get Part Prices</Button>

        <PartPricesResultBox data={partPricesResult} />
      </div>

      {/* ===== GET LATEST ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Latest Part Price</h3>

        <FormGrid>
          <Input placeholder="Part ID" value={latestPartPriceId} onChange={(e) => setLatestPartPriceId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetLatestPartPrice} className="mb-2">Get Latest Part Price</Button>

        <PartPricesResultBox data={latestPartPriceResult} />
      </div>

      {/* ===== ADD ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Part Price</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin, Manager
        </p>

        <FormGrid>
          <Input name="id" placeholder="Part ID" value={addForm.id} onChange={handleAddChange} />
          <Input name="price" placeholder="Part Price" value={addForm.price} onChange={handleAddChange} />
        </FormGrid>

        <Button onClick={handleAdd} className="mb-2">Add Part Price</Button>

        <PartPricesResultBox data={addResult} />
      </div>

    </Section>
  );
};

export default PartPricesSection;