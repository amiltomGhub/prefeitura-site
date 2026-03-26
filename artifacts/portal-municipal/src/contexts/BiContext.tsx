import React, { createContext, useContext, useState, useCallback } from "react";
import { subDays, subMonths, subQuarters, subYears, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type PeriodoId = "hoje" | "semana" | "mes" | "trimestre" | "ano" | "custom";

export interface Periodo {
  id: PeriodoId;
  label: string;
  inicio: Date;
  fim: Date;
}

const now = new Date();

function buildPeriodo(id: PeriodoId): Periodo {
  switch (id) {
    case "hoje": return { id, label: "Hoje", inicio: startOfDay(now), fim: endOfDay(now) };
    case "semana": return { id, label: "Esta semana", inicio: startOfWeek(now, { locale: ptBR }), fim: endOfDay(now) };
    case "mes": return { id, label: "Este mês", inicio: startOfMonth(now), fim: endOfDay(now) };
    case "trimestre": return { id, label: "Este trimestre", inicio: startOfQuarter(now), fim: endOfDay(now) };
    case "ano": return { id, label: "Este ano", inicio: startOfYear(now), fim: endOfDay(now) };
    default: return { id, label: "Este mês", inicio: startOfMonth(now), fim: endOfDay(now) };
  }
}

interface BiContextValue {
  periodo: Periodo;
  setPeriodo: (id: PeriodoId) => void;
  tvMode: boolean;
  setTvMode: (v: boolean) => void;
  formatarPeriodo: () => string;
}

const BiContext = createContext<BiContextValue | null>(null);

export function BiProvider({ children }: { children: React.ReactNode }) {
  const [periodoId, setPeriodoId] = useState<PeriodoId>("mes");
  const [tvMode, setTvMode] = useState(false);

  const periodo = buildPeriodo(periodoId);

  const setPeriodo = useCallback((id: PeriodoId) => setPeriodoId(id), []);

  const formatarPeriodo = useCallback(() =>
    `${format(periodo.inicio, "dd/MM/yyyy")} – ${format(periodo.fim, "dd/MM/yyyy")}`,
    [periodo]
  );

  return (
    <BiContext.Provider value={{ periodo, setPeriodo, tvMode, setTvMode, formatarPeriodo }}>
      {children}
    </BiContext.Provider>
  );
}

export function useBi() {
  const ctx = useContext(BiContext);
  if (!ctx) throw new Error("useBi must be used inside BiProvider");
  return ctx;
}
