import { useRef, useState, useEffect, useContext, FC, ChangeEvent, FormEvent } from 'react'
import { useRouter } from "next/navigation";
import AuthContext from '../../context/AuthContext';
import { getErrorMessage } from "@/utils/getErrorMessage";

interface LoginForm {
  email: string;
  password: string;
}

const LoginFeed: FC = () => {
  const router = useRouter()

  const userRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState<string>('')

  const contextValue = useContext(AuthContext);
  const { login } = contextValue || { login: async () => {} };

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      setForm({ email: "", password: "" })
      router.push('/')
    } catch (err) {
      setErrMsg(getErrorMessage(err));
      errRef.current?.focus();
    }
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, email: e.target.value }))
  const handlePwdInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, password: e.target.value }))

  const errClass = errMsg ? "text-center bg-white dark:bg-gray-900 text-[firebrick] p-[0.25em] mb-[0.5em]" : "offscreen"

  return (
    <div className="flex items-center my-44 bg-white dark:bg-gray-900">  
      <div className="container mx-auto max-w-md my-10">
        <div className="text-center">
          <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign in</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
        </div>
        <div className="m-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                ref={userRef}
                placeholder="Email"
                value={form.email}
                onChange={handleUserInput}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={handlePwdInput}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>

            <div ref={errRef} className={errClass}>{errMsg}</div>

            <div className="mb-6">
              <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:outline-none hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50">
                Sign in
              </button>
            </div>

          </form>
          
        </div>
      </div>
    </div>
  );
};

export default LoginFeed;
