import { FC, useState, useMemo } from 'react';
import { FaRegEdit } from "react-icons/fa";
import Order from './Order';
import Maintenance from './Maintenance';
import AccountInformation from './AccountInformation';
import { Order as OrderType, Maintenance as MaintenanceType, User } from '@/types';

interface StatusOption {
  value: string;
  label: string;
}

interface AccountFeedProps {
  user: User;
  orders: OrderType[];
  maintenances: MaintenanceType[];
}

const EmptyState = ({ text }: { text: string }) => (
    <p className="text-gray-500">{text}</p>
);

const AccountFeed: FC<AccountFeedProps> = ({ user, orders, maintenances }) => {
    type ServiceType = "Orders" | "Maintenances";
    const [selectedService, setSelectedService] = useState<ServiceType>("Orders");

    type StatusType = "ALL" | "PENDING" | "COMPLETED" | "CANCELLED" | "SCHEDULED";
    const [selectedStatus, setSelectedStatus] = useState<StatusType>("ALL");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const ORDER_STATUSES: StatusOption[] = [
        { value: "PENDING", label: "Pending" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const MAINTENANCE_STATUSES: StatusOption[] = [
        { value: "SCHEDULED", label: "Scheduled" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const statusOptions: StatusOption[] =
    selectedService === "Orders"
        ? ORDER_STATUSES
        : MAINTENANCE_STATUSES;

    const filteredOrders = useMemo(() => {
        if (selectedStatus === "ALL") return orders;

        return orders.filter(
            (o) => o.orderStatus?.toUpperCase() === selectedStatus
        );
    }, [orders, selectedStatus]);

    const filteredMaintenances = useMemo(() => {
        if (selectedStatus === "ALL") return maintenances;

        return maintenances.filter(
            (m) => m.maintenanceStatus?.toUpperCase() === selectedStatus
        );
    }, [maintenances, selectedStatus]);

  return (
    <div className="flex size-full bg-white dark:bg-indigo-950   md:py-8">
        <div className="flex flex-col w-full mx-auto my-4 lg:my-0 max-w-5xl px-4 2xl:px-0 ">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Account Information
                </h2>

                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center cursor-pointer gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500 transition">
                        <FaRegEdit />Edit
                    </button>
                )}
            </div>

            <AccountInformation user={user} isEditing={isEditing} setIsEditing={setIsEditing} />

            <div className='flex flex-col w-full mt-10'>
                <div className="flex flex-col lg:flex-row w-full justify-between items-center">
                    
                    <div className="sm:flex sm:items-center my-4">
                        <label htmlFor="service-type" className="sr-only">Select service type</label>

                        <select id="service-type" value={selectedService} onChange={(e) => setSelectedService(e.target.value as ServiceType)} className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                            <option value="Orders">Orders</option>
                            <option value="Maintenances">Maintenances</option>
                        </select>
                    </div>

                    <div className="sm:flex sm:items-center">
                        <label htmlFor="service-status" className="sr-only">Select service status</label>

                        <select
                            id="service-status"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as StatusType)}
                            className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="ALL">All</option>

                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2 className="my-4 text-xl font-semibold text-gray-900 dark:text-white md:mb-6">{selectedService === "Orders" ? "Order History" : "Maintenance History"}</h2>
                    {selectedService === "Orders" ? (
                        filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <Order key={order.orderId} order={order} />
                            ))
                        ) : (
                            <EmptyState text="No orders found." />
                        )
                    ) : (
                        filteredMaintenances.length > 0 ? (
                            filteredMaintenances.map((m) => (
                                <Maintenance key={m.maintenanceId} maintenance={m} />
                            ))
                        ) : (
                            <EmptyState text="No maintenances found." />
                        )
                    )}
            </div>
        </div>
    </div>
  )
}

export default AccountFeed;
