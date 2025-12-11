import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import {
  saveUser,
  getUser,
  saveToken,
  getToken,
  removeUserAndToken
} from "../storage/authUserStorage";
import { ManagerDTO } from "../dtos/ManagerDTO";
import { UserDTO } from "../dtos/UserDTO";

export type AuthUser = (ManagerDTO | UserDTO) & { type: "manager" | "user" };


type AuthContextData = {
  user: AuthUser | null;
  loading: boolean;
  signInManager: (ges_email: string, ges_senha: string) => Promise<void>;
  signInUser: (usu_email: string, usu_senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Login Manager
  async function signInManager(ges_email: string, ges_senha: string) {
    try {
      const { data } = await api.post("/auth/manager/login", { ges_email, ges_senha });
      const token = data.token;
      const payload: ManagerDTO = data.manager;

      const formatted: AuthUser = { ...payload, type: "manager" };
      setUser(formatted);
      await saveUser(formatted);
      await saveToken(token);
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  }

  // Login User
  async function signInUser(usu_email: string, usu_senha: string) {
    try {
      const { data } = await api.post("/auth/user/login", { usu_email, usu_senha });
      const token = data.token;
      const payload: UserDTO = data.user;

      const formatted: AuthUser = { ...payload, type: "user" };
      setUser(formatted);
      await saveUser(formatted);
      await saveToken(token);
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  }

  // Carregar usuário e token do storage
  async function loadStorageData() {
    try {
      const storedUser = await getUser();
      const storedToken = await getToken();
      if (storedUser && storedToken) setUser(storedUser);
    } catch (error) {
      console.log("Erro ao carregar usuário do storage:", error);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function signOut() {
    setUser(null);
    await removeUserAndToken();
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInManager, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

