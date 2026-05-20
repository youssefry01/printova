import React, { JSX, useState } from 'react';
import Tabs from "../ui/Tabs";
import TechnicianSection from "./Sections/TechnicianSection";

type TabId = "technician";

const TechnicianDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabId>("technician");

    const tabs: { id: TabId; label: string }[] = [
        { id: "technician", label: "Technician" },
    ];

    const sections: Record<TabId, JSX.Element> = {
        technician: <TechnicianSection />,
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

export default TechnicianDashboard;