import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuth from '@/hooks/useAuth';
import { User } from '@/types/user';

interface Props {
  user: User;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

//const AccountInformation: React.FC<Props> = ({ user, isEditing, setIsEditing }) => {
const AccountInformation = ({ user, isEditing, setIsEditing }: Props) => {
    const { updateProfile, changePassword } = useAuth();
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (user) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
        });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const resetForm = () => {
        if (!user) return;

        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
        });
    };

    const [passwordForm, setPasswordForm] = useState<{
      oldPassword: string;
      newPassword: string;
    }>({
      oldPassword: "",
      newPassword: "",
    });
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };
    const handleChangePassword = async () => {
        await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
        console.error("Failed to update user", error);
        }
    };

  return (
    <div className="flex flex-col w-full mt-4">
        <div className="flex flex-col lg:flex-row w-full lg:items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          {!isEditing ? (
            // 🔹 VIEW MODE
            <div className="flex flex-col lg:flex-row gap-6 flex-wrap w-full justify-around">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  First Name
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  {user.firstName}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Last Name
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Phone
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  {user.phone}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Address
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  {user.address}
                </p>
              </div>
              
            </div>
          ) : (
            // 🔥 EDIT MODE
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 flex-wrap w-full justify-around lg:justify-start">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div className="col-span-3 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => { resetForm(); setIsEditing(false); }} className="px-4 py-2 text-sm rounded-lg border cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
                >
                  Save Changes
                </button>
              </div>

            </form>
          )}
        </div>

        {/* ==== Divider ==== */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">

          {/* Toggle Button */}
          <button type="button" onClick={() => setShowPasswordSection(!showPasswordSection)} className="text-sm font-medium cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500  transition">
            {showPasswordSection ? "Hide Password Settings" : "Change Password"}
          </button>

          {/* Password Section */}
          {showPasswordSection && (
            <div className="mt-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-3 text-gray-800  dark:text-gray-200">
                Change Your Password
              </h3>

              <div className="grid md:grid-cols-2 gap-4 dark:text-gray-200">
                <Input name="oldPassword" type="password" placeholder="Current Password" onChange={handlePasswordChange}/>
                <Input name="newPassword" type="password" placeholder="New Password" onChange={handlePasswordChange}/>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleChangePassword}>
                  Change Password
                </Button>
              </div>
            </div>
          )}
        </div>

    </div>
  )
}

export default AccountInformation;