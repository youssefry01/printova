import React, { JSX, useState } from 'react';
import Tabs from "../ui/Tabs";
import DeliverySection from "./Sections/DeliverySection";

type TabId = "delivery";

const DeliveryDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabId>("delivery");

    const tabs: { id: TabId; label: string }[] = [
        { id: "delivery", label: "Delivery" },
    ];

    const sections: Record<TabId, JSX.Element> = {
        delivery: <DeliverySection />,
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

export default DeliveryDashboard;