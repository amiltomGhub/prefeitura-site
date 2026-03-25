import { cn } from "@/lib/utils";

interface CmsCardProps {
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export function CmsCard({ className, children, padding = "md" }: CmsCardProps) {
  const padClass = { none: "", sm: "p-4", md: "p-6", lg: "p-8" }[padding];
  return (
    <div className={cn("bg-zinc-900 border border-white/5 rounded-2xl", padClass, className)}>
      {children}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
  color?: "default" | "green" | "red" | "yellow" | "blue";
  className?: string;
}

const COLOR_MAP = {
  default: { icon: "bg-white/5 text-zinc-400", value: "text-white", trend: "" },
  green: { icon: "bg-green-500/10 text-green-400", value: "text-green-400", trend: "text-green-400" },
  red: { icon: "bg-red-500/10 text-red-400", value: "text-red-400", trend: "text-red-400" },
  yellow: { icon: "bg-yellow-500/10 text-yellow-400", value: "text-yellow-400", trend: "text-yellow-400" },
  blue: { icon: "bg-blue-500/10 text-blue-400", value: "text-blue-400", trend: "text-blue-400" },
};

export function KpiCard({ label, value, sub, icon: Icon, trend, color = "default", className }: KpiCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={cn("bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", c.icon)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        {trend !== undefined && (
          <span className={cn("text-xs font-bold", trend.value >= 0 ? "text-green-400" : "text-red-400")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className={cn("text-3xl font-black tabular-nums", c.value)}>{value}</p>
        <p className="text-xs text-zinc-500 font-medium mt-1">{label}</p>
        {sub && <p className="text-[11px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: "publicado" | "rascunho" | "agendado" | "arquivado" | "conforme" | "atencao" | "pendente" | "ativo" | "inativo";
  className?: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  publicado: { bg: "bg-green-500/15", text: "text-green-400", label: "Publicado" },
  rascunho: { bg: "bg-zinc-500/15", text: "text-zinc-400", label: "Rascunho" },
  agendado: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Agendado" },
  arquivado: { bg: "bg-orange-500/15", text: "text-orange-400", label: "Arquivado" },
  conforme: { bg: "bg-green-500/15", text: "text-green-400", label: "Conforme" },
  atencao: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Atenção" },
  pendente: { bg: "bg-red-500/15", text: "text-red-400", label: "Pendente" },
  ativo: { bg: "bg-green-500/15", text: "text-green-400", label: "Ativo" },
  inativo: { bg: "bg-zinc-500/15", text: "text-zinc-400", label: "Inativo" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["rascunho"]!;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold", s.bg, s.text, className)}>
      {s.label}
    </span>
  );
}

export function CmsPageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function CmsEmptyState({ icon: Icon, title, description, action }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-zinc-600" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-zinc-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-zinc-600 max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
