import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LastUpdatedTagProps {
  date?: string | Date | null;
  className?: string;
  warnAfterDays?: number;
}

function isOutdated(date: Date, days: number) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs > days * 24 * 60 * 60 * 1000;
}

export function LastUpdatedTag({ date, className, warnAfterDays = 30 }: LastUpdatedTagProps) {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;
  const outdated = isOutdated(d, warnAfterDays);

  const formatted = d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        outdated ? "text-amber-600" : "text-muted-foreground",
        className
      )}
      title={outdated ? `Atenção: atualizado há mais de ${warnAfterDays} dias` : undefined}
    >
      <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      <span>Atualizado em: {formatted}</span>
      {outdated && <span className="sr-only"> (atenção: mais de {warnAfterDays} dias sem atualização)</span>}
    </span>
  );
}
