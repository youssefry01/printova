"use client";

import { useEffect } from 'react';
import CheckoutFeed from '@/components/Checkout/CheckoutFeed';
import Loading from '@/components/General/Loading';
import useTitle from '@/hooks/useTitle';
import useAuth from '@/hooks/useAuth';
import useCart from "@/hooks/useCart";
import useService from "@/hooks/useService";
import AuthGuard from "@/components/Auth/AuthGuard";

const CheckoutContent = () => {
    useTitle('Checkout - Printova');

    const { user } = useAuth();

    const { cart, fetchCart } = useCart();
    const { services, fetchServices } = useService();

    useEffect(() => {
    if (user) {
        fetchCart();
        fetchServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!user || cart === null) {
        return <Loading />;
    }

    return (
        <main className='flex flex-col bg-[#f7f7f8] grow w-full mt-20 dark:bg-indigo-950 z-50 font-family-poppins'>
            <CheckoutFeed cart={cart} services={services} />
        </main>
    );
};

const Checkout = () => {
    return (
        <AuthGuard>
            <CheckoutContent />
        </AuthGuard>
    );
};

export default Checkout;