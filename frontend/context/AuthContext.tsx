"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../api/axios";
import handleRequest from "../api/requestHandler";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<unknown>;
  register: (firstName: string, lastName: string, email: string, password: string, phone: string, address: string) => Promise<unknown>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<unknown>;
  hasRole: (roleName: string) => boolean;
  getUserById: (userId: string) => Promise<unknown>;
  getAllUsers: () => Promise<unknown>;
  updateProfile: (updatedData: Partial<User>) => Promise<User | unknown>;
  updateUserById: (id: string, updatedData: Partial<User>) => Promise<User | unknown>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (): Promise<void> => {
    const res = await handleRequest<User>(() =>
      api.get<User>("/api/auth/me")
    );

    if ("success" in res) return;

    setUser(res);
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await fetchUser();
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.userDTO);
      return res;
  };

  const logout = async () => {
      try {
          await api.post("/api/auth/logout", {}, {
              headers: { Authorization: undefined } // ← stop interceptor attaching access token
          });
      } catch (err) {
          console.warn("Logout failed:", err);
      } finally {
          localStorage.removeItem("accessToken");
          setUser(null);
          router.push("/");
      }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, phone: string, address: string) => {
      const res = await api.post("/api/auth/register", {
          firstName, lastName, email, password, phone, address,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.userDTO);
      return res;
  };
  const changePassword = async (oldPassword: string, newPassword: string) => {
    return await handleRequest(() => api.post("/api/auth/change-password", {
      oldPassword,
      newPassword
    }));
  };

  const getUserById = async (userId: string) => {
    const res = await handleRequest(() => api.get(`/api/user/${userId}`));
    return res;
  };

  const getAllUsers = async () => {
    const res = await handleRequest(() => api.get(`/api/user`));
    return res;
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    const res = await handleRequest<User>(() =>
      api.put(`/api/user/${user?.id}`, updatedData)
    );

    await fetchUser();
    return res;
  };

  const updateUserById = async (id: string, updatedData: Partial<User>) => {
    const res = await handleRequest<User>(() =>
      api.put(`/api/user/${id}`, updatedData)
    );

    await fetchUser();
    return res;
  };


  const hasRole = (roleName: string): boolean => {
    return user?.roles?.some(role => role.roleName === roleName) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, changePassword, hasRole, getUserById, getAllUsers, updateProfile, updateUserById }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
