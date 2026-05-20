import { useState, FC, FormEvent, ChangeEvent } from 'react';
import CartItem from './CartItem';
import { useRouter } from "next/navigation";
import { Cart, Service } from '@/types';
import useCart from '@/hooks/useCart';
import useOrder from '@/hooks/useOrder';

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface CheckoutFeedProps {
  cart: Cart;
  services: Service[];
}

interface ApiResponse {
  statusCodeValue: number;
}

const CheckoutFeed: FC<CheckoutFeedProps> = ({ cart, services }) => {
    const router = useRouter()

    const deliveryService = services ? services.find((service) => service.serviceName.toLowerCase() === "DELIVERY".toLowerCase()) : null;

    const { createOrder } = useOrder();
    const { updateCartItemQuantity, removeCartItem, clearCart } = useCart();

    const [address, setAddress] = useState<string>("");
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        console.log("SHOWING NOTIFICATION");
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 1000);
    };

    const handlePlaceOrder = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await createOrder(address) as ApiResponse;

            if (res?.statusCodeValue === 200) {
                showNotification('success', 'Order placed successfully!');
                setAddress("");
                setTimeout(() => router.push("/account"), 1000);
            } else {
                showNotification('error', 'Failed to place order.');
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err) {
            console.error("Failed to place order:", err);
            showNotification('error', 'Something went wrong.');
            setTimeout(() => window.location.reload(), 1000);
        }
    };

  return (
    <div className='flex flex-col w-full px-4 sm:px-6 lg:px-12 my-6 overflow-x-hidden'>

        <div className="flex flex-col justify-center">
            <div className='flex flex-row flex-wrap justify-evenly items-center'>
                <h2 className="font-manrope font-extrabold text-3xl lead-10 text-black dark:text-white text-center">Shopping Cart</h2>
                {cart && cart.items && cart.items.length > 0 && (
                    <button className="m-4 cursor-pointer text-red-500 text-base font-medium hover:text-red-600 transition-colors" onClick={() => { if (window.confirm("Are you sure you want to clear the cart?")) {clearCart();}}}>
                        Clear Cart
                    </button>
                )}
            </div>
            <div className="mt-9 w-full border-t border-gray-300" />
        </div>

        

        <div className='flex flex-col lg:flex-row w-full mt-9 gap-10 items-stretch'>
            <div className="flex flex-col w-full lg:w-2/3 mt-8">
                <ul className="flex flex-col gap-6">
                    {cart && cart.items && cart.items.length > 0 ? (
                        cart.items.map((item) => <CartItem item={item} updateCartItemQuantity={updateCartItemQuantity} removeCartItem={removeCartItem} key={item.partId} />)
                    ) : (
                        <p className="text-gray-500 dark:text-gray-300 text-center">Your cart is empty.</p>
                    )}
                </ul>
            </div>

            <div className='flex flex-col w-full max-w-md lg:w-1/3 bg-white rounded-lg px-6 py-8 my-10 lg:my-0 shrink-0'>
                <h2 className="font-manrope font-extrabold text-2xl lead-10 text-black mb-6">Order Summary</h2>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-normal text-lg text-gray-500">Subtotal</span>
                    <span className="font-semibold text-lg text-black">{cart ? cart.totalAmount : "0"} EGP</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-normal text-lg text-gray-500">Shipping</span>
                    <span className="font-semibold text-lg text-black">{deliveryService ? deliveryService.servicePrice : "0"} EGP</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <span className="font-normal text-lg text-gray-500">Total</span>
                    <span className="font-semibold text-lg text-green-600">{cart ? (cart.totalAmount ? cart.totalAmount : 0) + (deliveryService ? deliveryService.servicePrice : 0) : "0"} EGP</span>
                </div>
                <form className='flex flex-col w-full' onSubmit={handlePlaceOrder}>
                    <input type="text" placeholder="Address" className='mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-600 dark:text-white dark:placeholder-gray-300 dark:border-gray-700 dark:focus:ring-gray-900 dark:focus:border-gray-500' value={address} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} />
                    <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-white rounded active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-indigo-500 disabled:active:scale-100" disabled={!cart.items || !address} type='submit' >Place Order</button> 
                </form>
                {notification && (
                    <div className={`flex m-4 p-4 rounded-lg shadow-lg text-white font-medium transition-all
                        ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {notification.type === 'success' ? '✓' : '✕'} {notification.message}
                    </div>
                )}
                
            </div>

        </div>

    </div>
  )
}

export default CheckoutFeed;
