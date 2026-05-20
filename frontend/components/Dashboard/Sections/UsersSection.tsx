import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import UserResultBox from "../ResultBoxes/UserResultBox";
import useAuth from "@/hooks/useAuth";

type UpdateUserForm = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

const UsersSection = () => {
  const { getUserById, getAllUsers, updateUserById } = useAuth();

  // ---------- STATE ----------
  const [getUserId, setGetUserId] = useState("");
  const [getUserResult, setGetUserResult] = useState<unknown | null>(null);

  const [allUsersResult, setAllUsersResult] = useState<unknown | null>(null);

  const [updateForm, setUpdateForm] = useState<UpdateUserForm>({ id: "" });
  const [updateResult, setUpdateResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleGetUser = async () => {
    const res = await getUserById(getUserId);
    setGetUserResult(res);
  };

  const handleGetAllUsers = async () => {
    const res = await getAllUsers();
    setAllUsersResult(res);
  };

  const handleUpdateUser = async () => {
    const res = await updateUserById(updateForm.id, { firstName: updateForm.firstName, lastName: updateForm.lastName, email: updateForm.email, phone: updateForm.phone, address: updateForm.address });
    setUpdateResult(res);
  };
  return (
    <Section title="Users">

      {/* ===== GET USER ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get User By ID</h3>
        <p className="text-sm text-gray-500 mb-2">Admin: any user | User: own account only</p>

        <FormGrid>
          <Input placeholder="User ID" value={getUserId} onChange={(e) => setGetUserId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetUser} className="mb-2">Get User</Button>
        <UserResultBox data={getUserResult} />
      </div>

      {/* ===== GET ALL USERS ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Users</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin only</p>

        <Button onClick={handleGetAllUsers} className="mb-2">Get All</Button>
        <UserResultBox data={allUsersResult} />
      </div>

      {/* ===== UPDATE USER ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Update User</h3>
        <p className="text-sm text-gray-500 mb-2">Admin: any user | User: own account only</p>

        <FormGrid>
          <Input name="id" placeholder="User ID" onChange={handleUpdateChange} />
          <Input name="firstName" placeholder="First Name" onChange={handleUpdateChange} />
          <Input name="lastName" placeholder="Last Name" onChange={handleUpdateChange} />
          <Input name="email" placeholder="Email" onChange={handleUpdateChange} />
          <Input name="phone" placeholder="Phone Number" onChange={handleUpdateChange} />
          <Input name="address" placeholder="Address" onChange={handleUpdateChange} />
        </FormGrid>

        <Button onClick={handleUpdateUser} className="mb-2">Update</Button>
        <UserResultBox data={updateResult} />
      </div>

    </Section>
  );
};

export default UsersSection;