import React, { JSX, useState } from 'react';
import Tabs from "../ui/Tabs";
import RolesSection from "./Sections/RolesSection";
import CategoriesSection from "./Sections/CategoriesSection";
import SuppliersSection from "./Sections/SuppliersSection";
import ServicesSection from "./Sections/ServicesSection";
import PartsSection from "./Sections/PartsSection";
import PartPricesSection from "./Sections/PartPricesSection";
import StockSection from "./Sections/StockSection";
import PaymentMethodsSection from "./Sections/PaymentMethodsSection";
import PaymentsSection from "./Sections/PaymentsSection";

type TabId =
  | "roles"
  | "categories"
  | "suppliers"
  | "services"
  | "parts"
  | "partPrices"
  | "stock"
  | "paymentMethods"
  | "payment";

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabId>("roles");

    const tabs: { id: TabId; label: string }[] = [
        { id: "roles", label: "Roles" },
        { id: "categories", label: "Categories" },
        { id: "suppliers", label: "Suppliers" },
        { id: "services", label: "Services" },
        { id: "parts", label: "Parts" },
        { id: "partPrices", label: "Part Prices" },
        { id: "stock", label: "Stock" },
        { id: "paymentMethods", label: "Payment Methods" },
        { id: "payment", label: "Payment" },
    ];

    const sections: Record<TabId, JSX.Element> = {
        roles: <RolesSection />,
        categories: <CategoriesSection />,
        suppliers: <SuppliersSection />,
        services: <ServicesSection />,
        parts: <PartsSection />,
        partPrices: <PartPricesSection />,
        stock: <StockSection />,
        paymentMethods: <PaymentMethodsSection />,
        payment: <PaymentsSection />,
    };

  return (
    <>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={(tab: string) => setActiveTab(tab as TabId)} />

        <div className="mt-4">
            {sections[activeTab]}
        </div>
    </>
  )
}

export default ManagerDashboard;