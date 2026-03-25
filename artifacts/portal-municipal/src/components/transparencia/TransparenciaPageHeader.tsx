import { Link } from "wouter";
import { ChevronRight, Shield } from "lucide-react";
import { ComplianceBadge } from "./ComplianceBadge";
import { LastUpdatedTag } from "./LastUpdatedTag";

interface Crumb {
  label: string;
  href?: string;
}

interface TransparenciaPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  breadcrumbs?: Crumb[];
  lastUpdated?: string | null;
  complianceStatus?: "ok" | "warning" | "error";
  complianceLabel?: string;
  laiRef?: string;
  actions?: React.ReactNode;
}

export function TransparenciaPageHeader({
  title,
  subtitle,
  icon: Icon,
  breadcrumbs = [],
  lastUpdated,
  complianceStatus = "ok",
  complianceLabel,
  laiRef,
  actions,
}: TransparenciaPageHeaderProps) {
  const crumbs: Crumb[] = [
    { label: "Início", href: "/" },
    { label: "Transparência", href: "/transparencia" },
    ...breadcrumbs,
  ];

  return (
    <div className="bg-zinc-900 text-white border-b-4 border-primary">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-zinc-400 flex-wrap">
            {crumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
                {crumb.href && i < crumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors focus:outline-none focus:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium" aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex-1">
            {/* LAI ref badge */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Shield className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                LAI — Lei 12.527/2011
              </span>
              {laiRef && (
                <span className="text-xs text-zinc-500 font-mono">{laiRef}</span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                {title}
              </h1>
            </div>

            {subtitle && (
              <p className="mt-3 text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex items-center gap-4 mt-5 flex-wrap">
              <ComplianceBadge status={complianceStatus} label={complianceLabel} />
              {lastUpdated && <LastUpdatedTag date={lastUpdated} className="text-zinc-400" />}
            </div>
          </div>

          {/* Actions slot */}
          {actions && (
            <div className="flex flex-col sm:items-end gap-2 sm:flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
