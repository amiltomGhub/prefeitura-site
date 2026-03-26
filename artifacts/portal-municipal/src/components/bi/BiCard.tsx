import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── BiCard ──────────────────────────────────────────────────────────────────
interface BiCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPad?: boolean;
}
export function BiCard({ children, className, onClick, noPad }: BiCardProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border border-white/5 rounded-2xl",
        !noPad && "p-5",
        onClick && "cursor-pointer hover:border-white/10 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── BiSection ───────────────────────────────────────────────────────────────
export function BiSection({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// ─── BiLabel ─────────────────────────────────────────────────────────────────
export function BiLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-widest", className)}>
      {children}
    </p>
  );
}

// ─── Trend badge ─────────────────────────────────────────────────────────────
export function TrendBadge({ value, suffix = "%", invertColors = false }: { value: number; suffix?: string; invertColors?: boolean }) {
  const up = value > 0;
  const neutral = value === 0;
  const positive = invertColors ? !up : up;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
      neutral ? "bg-zinc-700 text-zinc-400" :
      positive ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
    )}>
      {neutral ? <Minus className="w-2.5 h-2.5" /> : up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {Math.abs(value)}{suffix}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiProps {
  label: string;
  value: string;
  sub?: string;
  variacao?: number;
  variacaoLabel?: string;
  invertColors?: boolean;
  icon: LucideIcon;
  cor: string;
  spark?: React.ReactNode;
  onClick?: () => void;
  status?: "ok" | "warning" | "critical";
}

export function BIKpiCard({ label, value, sub, variacao, variacaoLabel, invertColors, icon: Icon, cor, spark, onClick, status }: KpiProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border rounded-2xl p-4 flex flex-col gap-3 cursor-pointer group hover:border-white/10 transition-all",
        status === "ok" ? "border-white/5" :
        status === "warning" ? "border-yellow-500/30" :
        status === "critical" ? "border-red-500/30" :
        "border-white/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-tight">{label}</p>
          <p className="text-2xl font-black text-white mt-1 leading-none tabular-nums">{value}</p>
        </div>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", cor)}>
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {sub && <span className="text-xs text-zinc-500">{sub}</span>}
          {variacao !== undefined && (
            <TrendBadge value={variacao} invertColors={invertColors} />
          )}
          {variacaoLabel && <span className="text-[10px] text-zinc-600">{variacaoLabel}</span>}
        </div>
        {spark}
      </div>
    </div>
  );
}

// ─── Alert item ───────────────────────────────────────────────────────────────
export function BiAlertItem({ urgencia, icone, titulo, link, acao }: { urgencia: "critica" | "alta" | "media"; icone: string; titulo: string; link: string; acao: string }) {
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3 rounded-xl border",
      urgencia === "critica" ? "bg-red-500/8 border-red-500/20" :
      urgencia === "alta" ? "bg-orange-500/8 border-orange-500/20" :
      "bg-yellow-500/8 border-yellow-500/20"
    )}>
      <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icone}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-zinc-200 leading-snug">{titulo}</p>
      </div>
      <a href={acao} className={cn(
        "flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors",
        urgencia === "critica" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
        urgencia === "alta" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" :
        "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
      )}>{link}</a>
    </div>
  );
}
