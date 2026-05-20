import { useContext } from "react";
import PartPriceContext from "@/context/PartPriceContext";

const usePartPrice = () => {
  const context = useContext(PartPriceContext);

  if (!context) {
    throw new Error("usePartPrice must be used within PartPriceProvider");
  }

  return context;
};

export default usePartPrice;