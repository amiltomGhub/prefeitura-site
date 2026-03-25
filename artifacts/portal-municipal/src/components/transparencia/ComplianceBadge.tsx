import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "ok" | "warning" | "error";

interface ComplianceBadgeProps {
  status?: Status;
  label?: string;
  className?: string;
}

const CONFIG: Record<Status, { icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string; defaultLabel: string }> = {
  ok: {
    icon: ShieldCheck,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    defaultLabel: "Conforme LAI",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    defaultLabel: "Atenção LAI",
  },
  error: {
    icon: ShieldAlert,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    defaultLabel: "Pendência LAI",
  },
};

export function ComplianceBadge({ status = "ok", label, className }: ComplianceBadgeProps) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold",
        cfg.bg, cfg.text, cfg.border, className
      )}
      role="status"
      aria-label={`Conformidade LAI: ${label ?? cfg.defaultLabel}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {label ?? cfg.defaultLabel}
    </span>
  );
}
