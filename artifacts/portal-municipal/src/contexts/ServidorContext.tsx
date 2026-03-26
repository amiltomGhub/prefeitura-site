import React, { createContext, useContext, useState } from "react";

export interface ServidorUser {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  secretaria: string;
  email: string;
  foto?: string;
  isRH: boolean;
  isAdmin: boolean;
  token: string;
  tenantId: string;
}

interface ServidorContextType {
  servidor: ServidorUser;
  logout: () => void;
}

const ServidorContext = createContext<ServidorContextType | undefined>(undefined);

const MOCK_SERVIDOR: ServidorUser = {
  id: "srv-001",
  nome: "Ana Paula Ferreira Costa",
  matricula: "0012345",
  cargo: "Analista Administrativo",
  secretaria: "SEMAD",
  email: "ana.costa@parauapebas.pa.gov.br",
  isRH: false,
  isAdmin: false,
  token: "mock-jwt-token",
  tenantId: "tenant-parauapebas-001",
};

export function ServidorProvider({ children }: { children: React.ReactNode }) {
  const [servidor] = useState<ServidorUser>(MOCK_SERVIDOR);

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <ServidorContext.Provider value={{ servidor, logout }}>
      {children}
    </ServidorContext.Provider>
  );
}

export function useServidor() {
  const ctx = useContext(ServidorContext);
  if (!ctx) throw new Error("useServidor must be used within ServidorProvider");
  return ctx;
}

export const MOCK_RH_SERVIDOR: ServidorUser = {
  id: "usr-admin-001",
  nome: "João Silva — RH",
  matricula: "0009999",
  cargo: "Gerente de RH",
  secretaria: "SEMAD",
  email: "admin@parauapebas.pa.gov.br",
  isRH: true,
  isAdmin: true,
  token: "mock-admin-jwt",
  tenantId: "tenant-parauapebas-001",
};
