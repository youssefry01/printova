"use client";

import React, { useEffect } from 'react'
import useAuth from '@/hooks/useAuth';
import useTitle from '@/hooks/useTitle';
import AccountFeed from '@/components/Account/AccountFeed';
import Loading from '@/components/General/Loading';
import useMaintenance from '@/hooks/useMaintenance';
import useOrder from '@/hooks/useOrder';
import AuthGuard from '@/components/Auth/AuthGuard';

const AccountContent = () => {
  const { user } = useAuth();
  const pageTitle = user && user.firstName ? `@${user.firstName}` : 'Account'
  useTitle(`${pageTitle} - Printova`)

  const { orders, fetchOrders } = useOrder();
  const { maintenances, fetchMaintenances } = useMaintenance();


  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchMaintenances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return <Loading />;
  }

  return (
    <main className='flex flex-col bg-[#f7f7f8] grow w-full mt-20 dark:bg-indigo-950 z-50 font-family-poppins'>

      <AccountFeed user={user} orders={orders} maintenances={maintenances} />

    </main>
  )
}

const Account = () => {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  )
}

export default Account;