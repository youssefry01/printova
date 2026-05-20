import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import PaymentResultBox from "../ResultBoxes/PaymentResultBox";
import usePayment from "@/hooks/usePayment";


const PaymentsSection = () => {
  const { getAllPayments, getPaymentById } = usePayment();

  // ---------- STATE ----------
  const [allPaymentsResult, setAllPaymentsResult] = useState<unknown | null>(null);

  const [paymentId, setPaymentId] = useState("");
  const [paymentResult, setPaymentResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleGetAll = async () => {
    const res = await getAllPayments();
    setAllPaymentsResult(res);
  };

  const handleGetById = async () => {
    const res = await getPaymentById(paymentId);
    setPaymentResult(res);
  };
  
  return (
    <Section title="Payments">

      {/* ===== GET ALL ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Payments</h3>

        <Button onClick={handleGetAll} className="mb-2">Get All Payments</Button>

        <PaymentResultBox data={allPaymentsResult} />
      </div>

      {/* ===== GET BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Payment</h3>

        <FormGrid>
          <Input placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetById} className="mb-2">Get Payment</Button>

        <PaymentResultBox data={paymentResult} />
      </div>

    </Section>
  );
};

export default PaymentsSection;