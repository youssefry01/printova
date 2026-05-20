"use client";

import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import ManagerDashboard from '@/components/Dashboard/ManagerDashboard';
import DeliveryDashboard from '@/components/Dashboard/DeliveryDashboard';
import TechnicianDashboard from '@/components/Dashboard/TechnicianDashboard';
import Missing from '@/components/General/Missing';
import useTitle from '@/hooks/useTitle';
import useAuth from '@/hooks/useAuth';
import AuthGuard from '@/components/Auth/AuthGuard';

const Dashboard = () => {
    useTitle('Dashboard - Printova')
    const auth = useAuth();
    if (!auth) {
      throw new Error("AuthContext must be used within AuthProvider");
    }
    const { hasRole } = auth;

    if (!hasRole("ADMIN") && !hasRole("MANAGER") && !hasRole("DELIVERY") && !hasRole("TECHNICIAN")) {
        return <Missing />;
    }

  return (
    <main className='flex flex-col bg-[#f7f7f8] dark:text-white grow w-full pt-40 dark:bg-indigo-950 z-50 font-family-poppins px-20'>
        {hasRole("ADMIN") && <AdminDashboard />}
        {hasRole("MANAGER") && <ManagerDashboard />}
        {hasRole("DELIVERY") && <DeliveryDashboard />}
        {hasRole("TECHNICIAN") && <TechnicianDashboard />}
    </main>
  )
}
export default Dashboard;