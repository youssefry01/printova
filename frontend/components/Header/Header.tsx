"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GoTriangleDown } from "react-icons/go";
import { FaLock, FaShoppingCart, FaWrench } from "react-icons/fa";
import ThemeButton from "../ui/ThemeButton";
import AuthDropdown from "./AuthDropdown";
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { user, hasRole, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = Array.isArray(cart?.items)
  ? cart.items.reduce((total, item) => total + item.quantity, 0)
  : 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className='flex fixed top-0 w-full h-20 px-2 lg:px-4 justify-between lg:justify-evenly bg-indigo-500 z-9999 border-opacity-10 items-center select-none'>

        <Image className="cursor-pointer h-full w-auto" src="/logo.png" width={96} height={96} alt='logo' onClick={() => router.push("/")}/>

        <div className="flex items-center gap-3">
          <div className='relative text-white rounded-full cursor-pointer hover:bg-indigo-900/40 p-2 mr-4' onClick={() => router.push("/checkout")}>
            <FaShoppingCart className='size-5' />
            {cartItemsCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1'>
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </div>

          <div className='text-white rounded-full cursor-pointer hover:bg-indigo-900/40 p-2 mr-6' onClick={() => router.push("/maintenance")}>
            <FaWrench className='size-5' />
          </div>

          <ThemeButton />

          <div className='flex relative group ml-6' ref={dropdownRef}>

            <div className='flex bg-white rounded-full items-center p-4 w-24 text-[11px] h-7.5 gap-2 lg:text-[13px] leading-5 font-medium appearance-none hover:cursor-pointer focus:cursor-pointer' onClick={() => setDropdownVisible((prev) => !prev)} >
              {user ? 
                (
                  <div className='flex flex-row w-full text-center justify-center items-center text-indigo-800'>
                    <p className='truncate'>{user.firstName}</p>
                    <GoTriangleDown className='ml-2' />
                  </div>
                )
                : 
                (
                <div className='flex flex-row text-center justify-center items-center text-indigo-800'>
                  <FaLock className='self-center mr-1' />
                  <Link href='/login' onClick={() => setDropdownVisible(false)}>Login</Link>
                  <GoTriangleDown className='ml-2' />
                </div>
                )
              }
            </div>

            {dropdownVisible && <AuthDropdown user={user} logout={logout} hasRole={hasRole} />}

          </div>
        </div>

      </header>
    </>
  )
}

export default Header;