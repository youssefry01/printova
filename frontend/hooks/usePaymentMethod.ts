import { useContext } from "react";
import PaymentMethodContext from "@/context/PaymentMethodContext";

const usePaymentMethod = () => {
  const context = useContext(PaymentMethodContext);

  if (!context) {
    throw new Error("usePaymentMethod must be used within PaymentMethodProvider");
  }

  return context;
};

export default usePaymentMethod;