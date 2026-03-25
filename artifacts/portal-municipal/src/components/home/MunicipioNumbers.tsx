import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useGetMunicipioInfo, useGetOrcamento, useListServidores } from "@workspace/api-client-react";
import { Users, MapPin, TrendingUp, DollarSign } from "lucide-react";

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  source: string;
  format: (n: number) => string;
  color: string;
  active: boolean;
}

function StatCard({ icon: Icon, value, label, source, format, color, active }: StatCardProps) {
  const count = useCountUp(value, 2000, active);
  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <p
        className="text-3xl sm:text-4xl font-black text-white mb-1 tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {format(count)}
      </p>
      <p className="text-primary-foreground/80 font-semibold text-sm mb-1">{label}</p>
      <p className="text-primary-foreground/50 text-[11px]">{source}</p>
    </div>
  );
}

function formatPop(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M hab.`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}mil hab.`;
  return n.toLocaleString("pt-BR");
}

function formatArea(n: number) {
  return `${n.toLocaleString("pt-BR")} km²`;
}

function formatBudget(n: number) {
  if (n >= 1_000_000_000) return `R$ ${(n / 1_000_000_000).toFixed(1)}Bi`;
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(0)}M`;
  return `R$ ${(n / 1_000).toFixed(0)}k`;
}

function formatServ(n: number) {
  return `${n.toLocaleString("pt-BR")} serv.`;
}

export function MunicipioNumbers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { data: municipio } = useGetMunicipioInfo();
  const { data: orcamento } = useGetOrcamento({ ano: new Date().getFullYear() });
  const { data: servidores } = useListServidores({ limit: 1 });

  const stats = [
    {
      icon: Users,
      value: municipio?.populacao ?? 213247,
      label: "Habitantes",
      source: "Fonte: IBGE 2022",
      format: formatPop,
      color: "bg-blue-600/80",
    },
    {
      icon: MapPin,
      value: Math.round(municipio?.area ?? 6887),
      label: "Área do Município",
      source: "Fonte: IBGE 2022",
      format: formatArea,
      color: "bg-green-600/80",
    },
    {
      icon: DollarSign,
      value: Math.round((orcamento?.receitaPrevista ?? 1_200_000_000) / 1_000_000),
      label: "Orçamento Anual",
      source: `LOA ${new Date().getFullYear()}`,
      format: (n: number) => formatBudget(n * 1_000_000),
      color: "bg-yellow-600/80",
    },
    {
      icon: TrendingUp,
      value: servidores?.total ?? 4200,
      label: "Servidores Municipais",
      source: "Folha de Pagamento",
      format: formatServ,
      color: "bg-purple-600/80",
    },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="numeros-heading"
      className="py-14 sm:py-20 bg-primary relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">Dados Públicos</p>
          <h2 id="numeros-heading" className="text-2xl sm:text-3xl font-black text-white">
            Parauapebas em Números
          </h2>
          <p className="text-primary-foreground/70 mt-2 text-sm">
            Dados oficiais do município de Parauapebas — PA.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
