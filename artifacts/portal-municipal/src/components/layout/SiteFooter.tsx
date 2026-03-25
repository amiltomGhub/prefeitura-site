import { Link } from "wouter";
import {
  Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin,
  ExternalLink, Shield, FileText, Users, BarChart2, ScrollText,
  MessageSquare, Lock, Database
} from "lucide-react";
import { useGetTenantConfig } from "@workspace/api-client-react";

const QUICK_LINKS = [
  { label: "Notícias", href: "/noticias" },
  { label: "Agenda", href: "/agenda" },
  { label: "Serviços Online", href: "/servicos" },
  { label: "Concursos Públicos", href: "/concursos" },
  { label: "Licitações", href: "/licitacoes" },
  { label: "Legislação", href: "/legislacao" },
  { label: "Galeria", href: "/galeria" },
  { label: "Contato", href: "/contato" },
];

const TRANSPARENCIA_LINKS = [
  { label: "Acesso à Informação (LAI)", href: "/transparencia/lai", icon: Shield },
  { label: "Portal da Transparência", href: "/transparencia", icon: BarChart2 },
  { label: "SIC / e-SIC", href: "/transparencia/sic", icon: MessageSquare },
  { label: "Ouvidoria Municipal", href: "/ouvidoria", icon: MessageSquare },
  { label: "LGPD / Privacidade", href: "/privacidade", icon: Lock },
  { label: "Dados Abertos", href: "/transparencia/dados-abertos", icon: Database },
  { label: "Licitações e Contratos", href: "/licitacoes", icon: FileText },
  { label: "Convênios", href: "/transparencia/convenios", icon: ScrollText },
];

const COMPLIANCE_BADGES = [
  { label: "LAI", sublabel: "Lei 12.527/2011", title: "Conforme Lei de Acesso à Informação" },
  { label: "e-MAG", sublabel: "Versão 3.1", title: "Modelo de Acessibilidade em Governo Eletrônico" },
  { label: "WCAG", sublabel: "2.1 nível AA", title: "Web Content Accessibility Guidelines" },
  { label: "LGPD", sublabel: "Lei 13.709/2018", title: "Lei Geral de Proteção de Dados Pessoais" },
];

export function SiteFooter() {
  const { data: tenant } = useGetTenantConfig({ tenant: "parauapebas" });
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-zinc-900 text-zinc-300 mt-auto">
      {/* Faixa superior colorida */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── COLUNA 1: Identidade ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white p-1.5 flex-shrink-0 shadow-md">
                <img
                  src={tenant?.brasao ?? `${import.meta.env.BASE_URL}images/brasao.png`}
                  alt={`Brasão — ${tenant?.nome ?? "Prefeitura Municipal"}`}
                  className="w-full h-full object-contain"
                  width={56}
                  height={56}
                />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Prefeitura Municipal de</p>
                <h2 className="text-white font-black text-lg leading-none">{tenant?.nome ?? "Parauapebas"}</h2>
                <p className="text-[11px] text-zinc-500">{tenant?.estado ?? "Pará"}</p>
              </div>
            </div>

            <address className="not-italic space-y-2.5 text-sm text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Av. Presidente Médici, 1246 — Centro<br />
                  Parauapebas — PA, CEP 68.515-000
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                <a href="tel:+559433460000" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  (94) 3346-0000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:contato@parauapebas.pa.gov.br"
                  className="hover:text-white transition-colors focus:outline-none focus:underline break-all"
                >
                  contato@parauapebas.pa.gov.br
                </a>
              </div>
            </address>

            <div>
              <p className="text-xs text-zinc-500 mb-1">Horário de atendimento</p>
              <p className="text-sm text-zinc-300">Segunda a Sexta: 08h00 às 14h00</p>
            </div>

            {/* Redes sociais */}
            <div>
              <p className="text-xs text-zinc-500 mb-2.5 font-medium uppercase tracking-wider">Siga-nos</p>
              <div className="flex gap-2.5" role="list" aria-label="Redes sociais">
                {[
                  { Icon: Facebook, label: "Facebook", href: "https://facebook.com/prefeituraparauapebas", color: "hover:bg-[#1877F2]" },
                  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/prefeituraparauapebas", color: "hover:bg-[#E4405F]" },
                  { Icon: Twitter, label: "Twitter / X", href: "#", color: "hover:bg-[#1DA1F2]" },
                  { Icon: Youtube, label: "YouTube", href: "#", color: "hover:bg-[#FF0000]" },
                ].map(({ Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center ${color} hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                    role="listitem"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUNA 2: Links Rápidos ── */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-primary inline-block" aria-hidden="true" />
              Acesso Rápido
            </h3>
            <ul className="space-y-2.5" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 hover:text-white hover:pl-1.5 transition-all duration-150 focus:outline-none focus:text-white focus:underline inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUNA 3: Transparência (LAI) ── */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-accent inline-block" aria-hidden="true" />
              Transparência
            </h3>
            <ul className="space-y-2.5" role="list">
              {TRANSPARENCIA_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:text-white focus:underline group"
                  >
                    <Icon
                      className="w-3.5 h-3.5 text-zinc-600 group-hover:text-primary transition-colors flex-shrink-0"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUNA 4: Canais de Atendimento + Conformidade ── */}
          <div className="space-y-8">
            {/* Canais */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-secondary inline-block" aria-hidden="true" />
                Atendimento
              </h3>
              <div className="space-y-3">
                <a
                  href="https://wa.me/5594999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-green-400 transition-colors focus:outline-none focus:underline group"
                >
                  <span
                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-green-900/40 transition-colors flex-shrink-0"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </span>
                  <div>
                    <p className="font-medium text-zinc-300">WhatsApp</p>
                    <p className="text-xs text-zinc-500">Seg a Sex — 08h às 17h</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span
                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-zinc-300">156 — Central do Cidadão</p>
                    <p className="text-xs text-zinc-500">Seg a Sex — 07h às 19h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selos de conformidade */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-zinc-600 inline-block" aria-hidden="true" />
                Conformidade
              </h3>
              <div className="grid grid-cols-2 gap-2" role="list" aria-label="Selos de conformidade">
                {COMPLIANCE_BADGES.map(({ label, sublabel, title }) => (
                  <div
                    key={label}
                    role="listitem"
                    title={title}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-center hover:border-primary/50 transition-colors cursor-default"
                    aria-label={title}
                  >
                    <p className="text-[13px] font-black text-primary leading-none">{label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Rodapé Inferior ── */}
        <div className="mt-12 pt-6 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="text-center md:text-left">
              <p>
                © {year} Prefeitura Municipal de {tenant?.nome ?? "Parauapebas"} — CNPJ 05.058.441/0001-09
              </p>
              <p className="mt-0.5">
                Desenvolvido por{" "}
                <span className="text-zinc-400 font-semibold">Portal Municipal Inteligente</span>
                {" "}— Módulo 2: Site Institucional
              </p>
            </div>

            <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-4">
              <Link href="/mapa-do-site" className="hover:text-white transition-colors focus:outline-none focus:underline">Mapa do Site</Link>
              <Link href="/acessibilidade" className="hover:text-white transition-colors focus:outline-none focus:underline">Acessibilidade</Link>
              <Link href="/privacidade" className="hover:text-white transition-colors focus:outline-none focus:underline">Privacidade</Link>
              <Link href="/cookies" className="hover:text-white transition-colors focus:outline-none focus:underline">Cookies</Link>
              <a href="/admin" className="hover:text-white transition-colors focus:outline-none focus:underline flex items-center gap-1">
                Área Restrita <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
