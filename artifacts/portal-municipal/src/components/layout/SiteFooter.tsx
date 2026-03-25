import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { useGetTenantConfig } from "@workspace/api-client-react";

export function SiteFooter() {
  const { data: tenant } = useGetTenantConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-zinc-900 text-zinc-300 pt-16 pb-8 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Identity & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full p-1 flex-shrink-0 flex items-center justify-center">
                {tenant?.brasao ? (
                  <img src={tenant.brasao} alt="Brasão" className="w-full h-full object-contain" />
                ) : (
                  <img src={`${import.meta.env.BASE_URL}images/brasao.png`} alt="Brasão" className="w-full h-full object-contain" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Prefeitura de {tenant?.nome || 'São Exemplo'}</h3>
                <p className="text-sm text-zinc-400">{tenant?.estado || 'Estado'}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Portal oficial da Prefeitura Municipal. Informações, serviços e transparência para todos os cidadãos.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-zinc-800 pb-2">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Praça da Matriz, s/n - Centro<br/>CEP: 00000-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>(00) 3000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:contato@prefeitura.gov.br" className="hover:text-white transition-colors">contato@prefeitura.gov.br</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-zinc-800 pb-2">Acesso Rápido</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/transparencia" className="hover:text-primary transition-colors focus:outline-none focus:underline">Portal da Transparência</Link></li>
              <li><Link href="/servicos" className="hover:text-primary transition-colors focus:outline-none focus:underline">Carta de Serviços</Link></li>
              <li><Link href="/diario-oficial" className="hover:text-primary transition-colors focus:outline-none focus:underline">Diário Oficial</Link></li>
              <li><Link href="/licitacoes" className="hover:text-primary transition-colors focus:outline-none focus:underline">Licitações</Link></li>
              <li><Link href="/concursos" className="hover:text-primary transition-colors focus:outline-none focus:underline">Concursos e Seleções</Link></li>
              <li><Link href="/ouvidoria" className="hover:text-primary transition-colors focus:outline-none focus:underline">Ouvidoria Municipal (e-SIC)</Link></li>
            </ul>
          </div>

          {/* Compliance & Badges */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-zinc-800 pb-2">Conformidade</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 p-3 rounded-lg text-center text-xs font-bold border border-zinc-700 hover:border-primary transition-colors">
                Transparência<br/><span className="text-primary">LAI</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg text-center text-xs font-bold border border-zinc-700 hover:border-primary transition-colors">
                Acessibilidade<br/><span className="text-primary">e-MAG</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg text-center text-xs font-bold border border-zinc-700 hover:border-primary transition-colors">
                Privacidade<br/><span className="text-primary">LGPD</span>
              </div>
              <div className="bg-zinc-800 p-3 rounded-lg text-center text-xs font-bold border border-zinc-700 hover:border-primary transition-colors">
                W3C<br/><span className="text-primary">WCAG 2.1</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {currentYear} Prefeitura Municipal de {tenant?.nome || 'São Exemplo'}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-white transition-colors focus:outline-none focus:underline">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors focus:outline-none focus:underline">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
