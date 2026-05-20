"use client";

import MaintenanceFeed from '@/components/Maintenance/MaintenanceFeed';
import useTitle from '@/hooks/useTitle';
import AuthGuard from '@/components/Auth/AuthGuard';

const MaintenanceContent = () => {
  useTitle('Book Maintenance - Printova')

  return (
    <main className='dark:bg-indigo-950'>
      
      <MaintenanceFeed />

    </main>
  )
}

const Maintenance = () => {
  return (
    <AuthGuard>
      <MaintenanceContent />
    </AuthGuard>
  )
}
export default Maintenance;