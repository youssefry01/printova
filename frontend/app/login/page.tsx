"use client";
import LoginFeed from '@/components/Login/LoginFeed';
import useTitle from '@/hooks/useTitle';

const Login = () => {
  useTitle('Sign in - Printova')

  return (
    <main className='dark:bg-gray-900'>
      
      <LoginFeed />

    </main>
  )
}

export default Login;