import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface Municipio {
  id: string;
  nome: string;
  uf: string;
  brasao?: string;
  corPrimaria?: string;
  corSecundaria?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  foto?: string;
}

export interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: "reclamacao" | "denuncia" | "sugestao" | "elogio" | "solicitacao";
  categoria: string;
  titulo: string;
  descricao: string;
  status: "aberta" | "em_analise" | "respondida" | "arquivada";
  dataAbertura: string;
  dataAtualizacao: string;
  urgencia: "normal" | "urgente" | "emergencia";
  endereco?: string;
  pendingSync?: boolean;
}

interface AppContextValue {
  usuario: Usuario | null;
  municipio: Municipio | null;
  manifestacoes: Manifestacao[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: string, senha: string) => Promise<boolean>;
  logout: () => void;
  selecionarMunicipio: (m: Municipio) => void;
  adicionarManifestacao: (m: Omit<Manifestacao, "id" | "protocolo" | "dataAbertura" | "dataAtualizacao">) => Promise<Manifestacao>;
}

const AppContext = createContext<AppContextValue | null>(null);

const MUNICIPIOS_DEMO: Municipio[] = [
  { id: "parauapebas", nome: "Parauapebas", uf: "PA", corPrimaria: "#1565C0" },
  { id: "belem", nome: "Belém", uf: "PA", corPrimaria: "#0277BD" },
  { id: "manaus", nome: "Manaus", uf: "AM", corPrimaria: "#1B5E20" },
  { id: "fortaleza", nome: "Fortaleza", uf: "CE", corPrimaria: "#E65100" },
  { id: "recife", nome: "Recife", uf: "PE", corPrimaria: "#880E4F" },
  { id: "salvador", nome: "Salvador", uf: "BA", corPrimaria: "#1A237E" },
  { id: "curitiba", nome: "Curitiba", uf: "PR", corPrimaria: "#006064" },
  { id: "porto-alegre", nome: "Porto Alegre", uf: "RS", corPrimaria: "#BF360C" },
];

export const MUNICIPIOS = MUNICIPIOS_DEMO;

function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `OUV-${ano}-${num}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [usuarioStr, municipioStr, manifestStr] = await Promise.all([
          AsyncStorage.getItem("usuario"),
          AsyncStorage.getItem("municipio"),
          AsyncStorage.getItem("manifestacoes"),
        ]);
        if (usuarioStr) setUsuario(JSON.parse(usuarioStr));
        if (municipioStr) setMunicipio(JSON.parse(municipioStr));
        if (manifestStr) setManifestacoes(JSON.parse(manifestStr));
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback(async (cpf: string, _senha: string): Promise<boolean> => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return false;
    const u: Usuario = {
      id: "user-demo",
      nome: "Maria da Silva",
      cpf: cpfLimpo,
      email: "maria.silva@email.com",
      telefone: "(94) 99999-1234",
    };
    setUsuario(u);
    await AsyncStorage.setItem("usuario", JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUsuario(null);
    await AsyncStorage.removeItem("usuario");
  }, []);

  const selecionarMunicipio = useCallback(async (m: Municipio) => {
    setMunicipio(m);
    await AsyncStorage.setItem("municipio", JSON.stringify(m));
  }, []);

  const adicionarManifestacao = useCallback(async (dados: Omit<Manifestacao, "id" | "protocolo" | "dataAbertura" | "dataAtualizacao">): Promise<Manifestacao> => {
    const nova: Manifestacao = {
      ...dados,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      protocolo: gerarProtocolo(),
      dataAbertura: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    const novas = [nova, ...manifestacoes];
    setManifestacoes(novas);
    await AsyncStorage.setItem("manifestacoes", JSON.stringify(novas));
    return nova;
  }, [manifestacoes]);

  return (
    <AppContext.Provider value={{
      usuario,
      municipio,
      manifestacoes,
      isAuthenticated: !!usuario,
      isLoading,
      login,
      logout,
      selecionarMunicipio,
      adicionarManifestacao,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
