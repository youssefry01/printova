import { useState, useRef, useContext, FC, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation";
import AuthContext from '../../context/AuthContext';
import { getErrorMessage } from "@/utils/getErrorMessage";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const RegisterFeed: FC = () => {
  const router = useRouter();
  const contextValue = useContext(AuthContext);
  const { register } = contextValue || { register: async () => {} };
  const errRef = useRef<HTMLParagraphElement>(null)
  const [form, setForm] = useState<RegisterForm>({ firstName: "", lastName: "", email: "", password: "", phone: "", address: "" });
  const [errMsg, setErrMsg] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(form.firstName, form.lastName, form.email, form.password, form.phone, form.address);
      setForm({ firstName: "", lastName: "", email: "", password: "", phone: "", address: "" })
      router.push('/')
    } catch (err) {
      setErrMsg(getErrorMessage(err));
      errRef.current?.focus();
    }
  };

  const handleFirstnameInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, firstName: e.target.value }))
  const handleLastnameInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, lastName: e.target.value }))
  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, email: e.target.value }))
  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, password: e.target.value }))
  const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, phone: e.target.value }))
  const handleAddressInput = (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, address: e.target.value }))


  const errClass = errMsg ? "text-center bg-white dark:bg-gray-900 text-[firebrick] p-[0.25em] mb-[0.5em]" : "offscreen"

  return (
    <div className="flex items-center my-44 bg-white dark:bg-gray-900">  
      <div className="container mx-auto max-w-md my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign Up to create an account</p>
          </div>
          <div className="m-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="firstName" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleFirstnameInput}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="lastName" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleLastnameInput}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleEmailInput}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (at least 8 characters and 1 capital letter)"
                  value={form.password}
                  onChange={handlePasswordInput}
                  autoComplete='off'
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handlePhoneInput}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="address" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleAddressInput}
                  autoComplete="off"
                  required
                  className={`w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500`}
                />
              </div>

              <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

              <div className="mb-6">
                <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:outline-none disabled:opacity-50 hover:bg-indigo-700 transition-colors cursor-pointer">
                  Sign Up
                </button>
              </div>

            </form>
            
          </div>
        </div>
    </div>
  );
};

export default RegisterFeed;
