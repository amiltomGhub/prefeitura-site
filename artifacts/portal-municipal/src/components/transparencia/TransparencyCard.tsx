import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ComplianceBadge } from "./ComplianceBadge";
import { LastUpdatedTag } from "./LastUpdatedTag";
import { cn } from "@/lib/utils";

interface TransparencyCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  lastUpdated?: string | null;
  complianceStatus?: "ok" | "warning" | "error";
  badge?: string;
  highlight?: boolean;
  external?: boolean;
  laiRef?: string;
}

export function TransparencyCard({
  icon: Icon,
  title,
  description,
  href,
  lastUpdated,
  complianceStatus = "ok",
  badge,
  highlight,
  external,
  laiRef,
}: TransparencyCardProps) {
  const isExternal = external ?? href.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-card border-2 rounded-2xl p-6 transition-all duration-200 focus-within:ring-4 focus-within:ring-primary/20",
        highlight
          ? "border-primary/40 bg-primary/5 shadow-md hover:shadow-xl hover:border-primary"
          : "border-border hover:border-primary/40 hover:shadow-md"
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-5 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
          {badge}
        </span>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
          highlight ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
        )}>
          <Icon className={cn("w-6 h-6", highlight ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors")} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base leading-tight mb-1">
            {title}
          </h3>
          {laiRef && <p className="text-[11px] text-muted-foreground font-mono">{laiRef}</p>}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
        <div className="flex flex-col gap-1.5">
          <ComplianceBadge status={complianceStatus} />
          {lastUpdated && <LastUpdatedTag date={lastUpdated} />}
        </div>

        <Link
          href={href}
          {...linkProps}
          className="inline-flex items-center gap-2 text-primary font-bold text-sm focus:outline-none focus:underline whitespace-nowrap"
          aria-label={`Acessar ${title}`}
        >
          Acessar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
