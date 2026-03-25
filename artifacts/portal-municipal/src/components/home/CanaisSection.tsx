import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "5594999999999";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá%2C%20gostaria%20de%20informações.`;

export function CanaisSection() {
  return (
    <section
      aria-labelledby="canais-heading"
      className="py-14 sm:py-20 bg-gradient-to-br from-primary via-primary to-blue-900 text-white relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">Fale Conosco</p>
          <h2 id="canais-heading" className="text-2xl sm:text-3xl font-black text-white mb-3">
            Canais de Comunicação
          </h2>
          <p className="text-primary-foreground/70 text-sm max-w-lg mx-auto">
            Entre em contato com a Prefeitura de Parauapebas pelos canais oficiais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-6 rounded-2xl bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400/40"
            aria-label="WhatsApp oficial da Prefeitura"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <h3 className="font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-primary-foreground/60 text-xs">Seg a Sex — 08h às 17h</p>
            <p className="text-green-400 font-semibold text-sm mt-2">(94) 99999-9999</p>
          </a>

          {/* Ouvidoria */}
          <a
            href="/ouvidoria"
            className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-yellow-400"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            </div>
            <h3 className="font-bold text-white mb-1">Ouvidoria</h3>
            <p className="text-primary-foreground/60 text-xs">Registre sua manifestação</p>
            <p className="text-yellow-400 font-semibold text-sm mt-2">Fale Conosco</p>
          </a>

          {/* SIC */}
          <a
            href="/transparencia/sic"
            className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-blue-300" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-white mb-1">SIC / e-SIC</h3>
            <p className="text-primary-foreground/60 text-xs">Pedido de acesso à informação</p>
            <p className="text-blue-300 font-semibold text-sm mt-2">LAI — Lei 12.527</p>
          </a>

          {/* Telefone 156 */}
          <a
            href="tel:156"
            className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-purple-300" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-white mb-1">Central 156</h3>
            <p className="text-primary-foreground/60 text-xs">Atendimento telefônico</p>
            <p className="text-purple-300 font-semibold text-sm mt-2">Ligue grátis: 156</p>
          </a>
        </div>

        {/* Social media */}
        <div className="text-center">
          <p className="text-primary-foreground/50 text-xs mb-4 uppercase tracking-wider font-semibold">Redes Sociais Oficiais</p>
          <div className="flex items-center justify-center gap-4" role="list" aria-label="Redes sociais oficiais">
            {[
              { icon: Facebook, label: "Facebook", href: "https://facebook.com/prefeituraparauapebas", color: "hover:bg-[#1877F2]" },
              { icon: Instagram, label: "Instagram", href: "https://instagram.com/prefeituraparauapebas", color: "hover:bg-[#E4405F]" },
              { icon: Youtube, label: "YouTube", href: "#", color: "hover:bg-[#FF0000]" },
            ].map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} oficial`}
                className={`w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center ${color} hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white`}
                role="listitem"
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
