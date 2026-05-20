import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import MaintenanceResultBox from "../ResultBoxes/MaintenanceResultBox";
import useMaintenance from "@/hooks/useMaintenance";

const TechnicianSection = () => {
  const { getTechnicianMaintenances, completeMaintenance } = useMaintenance();

  // ---------- STATE ----------
  const [status, setStatus] = useState("SCHEDULED");
  const [allTechnicianMaintenancesResult, setAllTechnicianMaintenancesResult] = useState<unknown | null>(null);

  const STATUSES = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const [completeMaintenanceId, setCompleteMaintenanceId] = useState("");
  const [completeMaintenanceResult, setCompleteMaintenanceResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleGetTechnicianMaintenances = async () => {
    const res = await getTechnicianMaintenances(status);
    setAllTechnicianMaintenancesResult(res);
  };

  const handleCompleteMaintenance = async () => {
    const res = await completeMaintenance(completeMaintenanceId);
    setCompleteMaintenanceResult(res);
  };
  
  return (
    <Section title="Technician Maintenances">

      <div className="mb-6 bmaintenance-b bmaintenance-gray-200 dark:bmaintenance-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Technician Maintenances</h3>

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

        <Button onClick={handleGetTechnicianMaintenances} className="mb-2">Get All Technician Maintenances</Button>

        <MaintenanceResultBox data={allTechnicianMaintenancesResult} />
      </div>

      <div className="mb-6 bmaintenance-b bmaintenance-gray-200 dark:bmaintenance-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Complete Maintenance</h3>

        <FormGrid>
          <Input placeholder="Maintenance ID" value={completeMaintenanceId} onChange={(e) => setCompleteMaintenanceId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleCompleteMaintenance} className="mb-2">Complete Maintenance</Button>

        <MaintenanceResultBox data={completeMaintenanceResult} />
      </div>

    </Section>
  );
};

export default TechnicianSection;