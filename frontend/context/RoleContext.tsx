"use client";

import { createContext, FC, ReactNode, useState } from "react";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { Role } from "@/types";

interface RoleContextType {
  roles: Role[] | null;
  setRoles: React.Dispatch<React.SetStateAction<Role[] | null>>;
  getRoleById: (roleId: string) => Promise<unknown>;
  getAllRoles: () => Promise<unknown>;
  addRole: (roleName: string) => Promise<unknown>;
  getUserRoles: (userId: string) => Promise<unknown>;
  addUserRole: (userId: string, roleName: string) => Promise<unknown>;
  removeUserRole: (userId: string, roleName: string) => Promise<unknown>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[] | null>(null);

  const getRoleById = async (roleId: string) => {
    return await handleRequest(() => api.get(`/api/roles/${roleId}`));
  };

  const getAllRoles = async () => {
    return await handleRequest(() => api.get(`/api/roles`));
  };

  const addRole = async (roleName: string) => {
    return await handleRequest(() => api.post(`/api/roles`, { roleName }));
  };

  const getUserRoles = async (userId: string) => {
    return await handleRequest(() => api.get(`/api/roles/user/${userId}`));
  };
  
  const addUserRole = async (userId: string, roleName: string) => {
    return await handleRequest(() => api.post(`/api/roles/user/${userId}`, { roleName }));
  };

  const removeUserRole = async (userId: string, roleName: string) => {
    return await handleRequest(() => api.delete(`/api/roles/user/${userId}`, {data: { roleName }}));
  };

  return (
    <RoleContext.Provider value={{ roles, setRoles, getRoleById, getAllRoles, addRole, getUserRoles, addUserRole, removeUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;