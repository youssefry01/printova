"use client";
import RegisterFeed from '@/components/Register/RegisterFeed';
import useTitle from '@/hooks/useTitle';

const Register = () => {
  useTitle('Sign up - Printova')

  return (
    <main className='dark:bg-gray-900'>
      
      <RegisterFeed />

    </main>
  )
}

export default Register;