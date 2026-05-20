import { useContext } from "react";
import PaymentContext from "@/context/PaymentContext";

const usePayment = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }

  return context;
};

export default usePayment;