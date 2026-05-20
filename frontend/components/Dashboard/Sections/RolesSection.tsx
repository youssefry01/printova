import { useState } from "react";
import Section from "../../ui/Section";
import FormGrid from "../../ui/FormGrid";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import RoleResultBox from "../ResultBoxes/RoleResultBox";
import useRole from "@/hooks/useRole";

type AddRoleForm = {
  roleName: string;
};

type AddUserRoleForm = {
  userId: string;
  roleName: string;
};

type RemoveUserRoleForm = {
  userId: string;
  roleName: string;
};

const RolesSection = () => {
  const { getAllRoles, getRoleById, addRole,getUserRoles, addUserRole, removeUserRole } = useRole();

  // ---------- STATE ----------
  const [roleId, setRoleId] = useState("");
  const [roleByIdResult, setRoleByIdResult] = useState<unknown | null>(null);

  const [allRolesResult, setAllRolesResult] = useState<unknown | null>(null);

  const [addRoleForm, setAddRoleForm] = useState<AddRoleForm>({ roleName: "" });
  const [addRoleResult, setAddRoleResult] = useState<unknown | null>(null);

  const [userRolesUserId, setUserRolesUserId] = useState("");
  const [userRolesResult, setUserRolesResult] = useState<unknown | null>(null);

  const [addUserRoleForm, setAddUserRoleForm] = useState<AddUserRoleForm>({ userId: "", roleName: "" });
  const [addUserRoleResult, setAddUserRoleResult] = useState<unknown | null>(null);

  const [removeUserRoleForm, setRemoveUserRoleForm] = useState<RemoveUserRoleForm>({ userId: "", roleName: "" });
  const [removeUserRoleResult, setRemoveUserRoleResult] = useState<unknown | null>(null);

  // ---------- HANDLERS ----------
  const handleAddUserRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddUserRoleForm({ ...addUserRoleForm, [e.target.name]: e.target.value });
  };

  const handleRemoveUserRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveUserRoleForm({ ...removeUserRoleForm, [e.target.name]: e.target.value });
  };

  const handleGetAllRoles = async () => {
    const res = await getAllRoles();
    setAllRolesResult(res);
  };

  const handleGetRoleById = async () => {
    const res = await getRoleById(roleId);
    setRoleByIdResult(res);
  };

  const handleAddRole = async () => {
    const res = await addRole(addRoleForm.roleName);
    setAddRoleResult(res);
  };

  const handleGetUserRoles = async () => {
    const res = await getUserRoles(userRolesUserId);
    setUserRolesResult(res);
  };

  const handleAddUserRole = async () => {
    const res = await addUserRole(addUserRoleForm.userId, addUserRoleForm.roleName);
    setAddUserRoleResult(res);
  };

  const handleRemoveUserRole = async () => {
    const res = await removeUserRole(removeUserRoleForm.userId, removeUserRoleForm.roleName);
    setRemoveUserRoleResult(res);
  };

  return (
    <Section title="Roles">

      {/* ===== GET ALL ROLES ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get All Roles</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin only</p>

        <Button onClick={handleGetAllRoles} className="mb-2">Get All Roles</Button>
        <RoleResultBox data={allRolesResult} />
      </div>

      {/* ===== GET ROLE BY ID ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get Role By ID</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin only</p>

        <FormGrid>
          <Input placeholder="Role ID" value={roleId} onChange={(e) => setRoleId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetRoleById} className="mb-2">Get Role By ID</Button>
        <RoleResultBox data={roleByIdResult} />
      </div>

      {/* ===== ADD ROLE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add Role</h3>
        <p className="text-sm text-gray-500 mb-2">Allowed Roles: Admin only</p>

        <FormGrid>
          <Input placeholder="Role Name" value={addRoleForm.roleName} onChange={(e) => setAddRoleForm({ ...addRoleForm, roleName: e.target.value })} />
        </FormGrid>

        <Button onClick={handleAddRole} className="mb-2">Add Role</Button>
        <RoleResultBox data={addRoleResult} />
      </div>

      {/* ===== GET USER ROLES ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Get User Roles</h3>
        <p className="text-sm text-gray-500 mb-2">Admin: any user | User: own account only</p>

        <FormGrid>
          <Input placeholder="User ID" value={userRolesUserId} onChange={(e) => setUserRolesUserId(e.target.value)} />
        </FormGrid>

        <Button onClick={handleGetUserRoles} className="mb-2">Get User Roles</Button>
        <RoleResultBox data={userRolesResult} />
      </div>

      {/* ===== ADD USER ROLE ===== */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-1">Add User Role</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin any role | Manager: only roles below Manager | User: no role management
        </p>

        <FormGrid>
          <Input name="userId" placeholder="User ID" onChange={handleAddUserRoleChange} />
          <Input name="roleName" placeholder="Role Name" onChange={handleAddUserRoleChange} />
        </FormGrid>

        <Button onClick={handleAddUserRole} className="mb-2">Add User Role</Button>
        <RoleResultBox data={addUserRoleResult} />
      </div>

      {/* ===== REMOVE USER ROLE ===== */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-1">Remove User Role</h3>
        <p className="text-sm text-gray-500 mb-2">
          Allowed Roles: Admin any role | Manager: only roles below Manager | User: no role management
        </p>

        <FormGrid>
          <Input name="userId" placeholder="User ID" onChange={handleRemoveUserRoleChange} />
          <Input name="roleName" placeholder="Role Name" onChange={handleRemoveUserRoleChange} />
        </FormGrid>

        <Button onClick={handleRemoveUserRole} className="mb-2">Remove User Role</Button>
        <RoleResultBox data={removeUserRoleResult} />
      </div>

    </Section>
  );
};

export default RolesSection;