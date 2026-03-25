import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  FileText, Landmark, Users, CalendarDays, MessageSquare,
  FileBarChart, GraduationCap, ShieldCheck, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { title: "Ouvidoria", desc: "Registre manifestações", href: "/ouvidoria", icon: MessageSquare, color: "bg-red-100 text-red-700", badge: null },
  { title: "SIC / e-SIC", desc: "Pedidos de informação", href: "/transparencia/sic", icon: ShieldCheck, color: "bg-blue-100 text-blue-700", badge: null },
  { title: "IPTU Online", desc: "2ª via e emissão", href: "/servicos/iptu", icon: Landmark, color: "bg-green-100 text-green-700", badge: null },
  { title: "Nota Fiscal", desc: "Emissão NFS-e", href: "/servicos/nota-fiscal", icon: FileText, color: "bg-purple-100 text-purple-700", badge: "Novo" },
  { title: "Contracheque", desc: "Portal do servidor", href: "/servicos/contracheque", icon: Users, color: "bg-orange-100 text-orange-700", badge: null },
  { title: "Licitações", desc: "Editais abertos", href: "/licitacoes", icon: FileBarChart, color: "bg-yellow-100 text-yellow-700", badge: null },
  { title: "Concursos", desc: "Vagas e seleções", href: "/concursos", icon: GraduationCap, color: "bg-teal-100 text-teal-700", badge: "Aberto" },
  { title: "Agendamentos", desc: "Serviços presenciais", href: "/servicos/agendamento", icon: CalendarDays, color: "bg-pink-100 text-pink-700", badge: null },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function QuickServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="servicos-rapidos-heading" className="py-14 sm:py-20 bg-background relative z-30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Acesso Rápido</p>
            <h2 id="servicos-rapidos-heading" className="text-2xl sm:text-3xl font-black text-foreground">
              Serviços Mais Procurados
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Os serviços mais acessados pelos cidadãos de Parauapebas.
            </p>
          </div>
          <Link
            href="/servicos"
            className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline focus:outline-none focus:underline text-sm whitespace-nowrap"
          >
            Ver todos os serviços <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <motion.ul
          role="list"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.li key={svc.href} variants={item}>
                <Link
                  href={svc.href}
                  className="group relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 h-full"
                >
                  {svc.badge && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      {svc.badge}
                    </span>
                  )}
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300",
                    svc.color
                  )}>
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
                    {svc.desc}
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/10 px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            Ver todos os serviços <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
