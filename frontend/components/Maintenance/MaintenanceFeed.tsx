import { useState, useEffect } from "react"
import { useRouter } from "next/navigation.js";
import useService from "@/hooks/useService";
import useMaintenance from "@/hooks/useMaintenance";

type NotificationType = "success" | "error";

interface Notification {
  type: NotificationType;
  message: string;
}

interface MaintenanceForm {
  description: string;
  address: string;
  date: string;
  time: string;
}

interface ApiResponse {
  statusCodeValue: number;
}

const MaintenanceFeed = () => {
  const router = useRouter()
  const { createMaintenance } = useMaintenance();
  const { services, fetchServices } = useService();
  const maintenanceService = services.find((s) => s.serviceName === "MAINTENANCE");
  const maintenancePrice = maintenanceService?.servicePrice;

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState<MaintenanceForm>({
    description: "",
    address: "",
    date: "",
    time: "",
  });

  const [notification, setNotification] = useState<Notification | null>(null);
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 1000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getMinTime = () => {
    if (!form.date) return "09:00";
    const today = new Date();
    const selectedDate = new Date(form.date);
    if (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    ) {
      const nextHour = Math.min(today.getHours() + 1, 16); // cap at 16
      return Math.max(nextHour, 9).toString().padStart(2, "0") + ":00";
    }
    return "09:00";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select a date and time");
      return;
    }

    const selectedDateTime = new Date(`${form.date}T${form.time}:00`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("Cannot select a past date/time");
      return;
    }

    const datetime = `${form.date}T${form.time}:00`;
    try {

      const res = await createMaintenance({
        description: form.description,
        address: form.address,
        date: datetime,
      }) as ApiResponse;

      if (res?.statusCodeValue === 200) {
        showNotification('success', 'Maintenance booked successfully!');
        setTimeout(() => router.push("/account"), 1000);
      } else {
        showNotification('error', `Failed to book maintenance.`);
      }
    } catch (err) {
      console.error("Failed to book maintenance:", err);
    }
  };
  
  const today = new Date();
  const minDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="flex items-center my-44 bg-white dark:bg-indigo-950">  
      <div className="container mx-auto max-w-md my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Book Maintenance</h1>
            <p className="text-gray-500 dark:text-gray-300">Book a maintenance service</p>
          </div>
          <div className="m-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="description" className="block mb-2 text-sm text-gray-600 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleFormChange}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="address" className="block mb-2 text-sm text-gray-600 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleFormChange}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  min={minDate}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:text-gray-200"
                />
              </div>

              <div className="mb-6 ">
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Hour (minutes always 00, 9AM–4PM)
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleFormChange}
                  min={getMinTime()}
                  max="16:00"
                  step={3600}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:text-gray-200"
                />
              </div>

              <div className="mb-6">
                <div className="mb-6 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Service Fee</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Cash on Delivery</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{maintenancePrice || "Unknown"} EGP</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Due on arrival</p>
                  </div>
                </div>
                <button type="submit" disabled={getMinTime() > "16:00"} className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:outline-none disabled:opacity-50 hover:bg-indigo-700 transition-colors cursor-pointer">
                  Book Maintenance
                </button>

                {notification && (
                    <div className={`flex m-4 p-4 rounded-lg shadow-lg text-white font-medium transition-all
                        ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {notification.type === 'success' ? '✓' : '✕'} {notification.message}
                    </div>
                )}
              </div>

            </form>
            
          </div>
        </div>
    </div>
  );
};

export default MaintenanceFeed;