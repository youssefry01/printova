import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import DeliveryResultBox from "../ResultBoxes/DeliveryResultBox";
import useOrder from "@/hooks/useOrder";

const DeliverySection = () => {
  const { getDeliveryOrders, completeOrder } = useOrder();

  // ---------- STATE ----------
  const [status, setStatus] = useState("PENDING");
  const [allDeliveryOrdersResult, setAllDeliveryOrdersResult] = useState<unknown | null>(null);

  const STATUSES = [
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];
  const [completeOrderId, setCompleteOrderId] = useState("");
  const [completeOrderResult, setCompleteOrderResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleGetDeliveryOrders = async () => {
    const res = await getDeliveryOrders(status);
    setAllDeliveryOrdersResult(res);
  };

  const handleCompleteOrder = async () => {
    const res = await completeOrder(completeOrderId);
    setCompleteOrderResult(res);
  };
  
  return (
    <Section title="Delivery Orders">

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Delivery Orders</h3>

        <FormGrid>
            <select
                id="service-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-6 py-2 m-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
                {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>
        </FormGrid>

        <Button onClick={handleGetDeliveryOrders} className="mb-2">Get All Delivery Orders</Button>

        <DeliveryResultBox data={allDeliveryOrdersResult} />
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Complete Order</h3>

        <FormGrid>
          <Input placeholder="Order ID" value={completeOrderId} onChange={(e) => setCompleteOrderId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleCompleteOrder} className="mb-2">Complete Order</Button>

        <DeliveryResultBox data={completeOrderResult} />
      </div>

    </Section>
  );
};

export default DeliverySection;