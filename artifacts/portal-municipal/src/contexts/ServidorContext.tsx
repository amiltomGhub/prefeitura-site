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
  setRole: (role: "servidor" | "rh") => void;
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

export const MOCK_RH_SERVIDOR: ServidorUser = {
  id: "usr-admin-001",
  nome: "João Silva",
  matricula: "0009999",
  cargo: "Gerente de RH",
  secretaria: "SEMAD",
  email: "admin@parauapebas.pa.gov.br",
  isRH: true,
  isAdmin: true,
  token: "mock-admin-jwt",
  tenantId: "tenant-parauapebas-001",
};

function detectInitialRole(): ServidorUser {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("mock_role");
    if (stored === "rh") return MOCK_RH_SERVIDOR;
    const param = new URLSearchParams(window.location.search).get("role");
    if (param === "rh") {
      sessionStorage.setItem("mock_role", "rh");
      return MOCK_RH_SERVIDOR;
    }
  }
  return MOCK_SERVIDOR;
}

export function ServidorProvider({ children }: { children: React.ReactNode }) {
  const [servidor, setServidor] = useState<ServidorUser>(detectInitialRole);

  function setRole(role: "servidor" | "rh") {
    if (role === "rh") {
      sessionStorage.setItem("mock_role", "rh");
      setServidor(MOCK_RH_SERVIDOR);
    } else {
      sessionStorage.removeItem("mock_role");
      setServidor(MOCK_SERVIDOR);
    }
  }

  const logout = () => {
    sessionStorage.removeItem("mock_role");
    window.location.href = "/";
  };

  return (
    <ServidorContext.Provider value={{ servidor, setRole, logout }}>
      {children}
    </ServidorContext.Provider>
  );
}

export function useServidor() {
  const ctx = useContext(ServidorContext);
  if (!ctx) throw new Error("useServidor must be used within ServidorProvider");
  return ctx;
}
