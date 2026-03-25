import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useListNoticias, useListServicos, useGetOrcamento } from "@workspace/api-client-react";
import { ArrowRight, FileText, Landmark, FileBarChart, CalendarDays, Users, AlertTriangle, Search } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Home() {
  const { data: noticiasData, isLoading: loadingNoticias } = useListNoticias({ limit: 3, destaque: true });
  const { data: servicosData, isLoading: loadingServicos } = useListServicos({ limit: 6 });
  const currentYear = new Date().getFullYear();
  const { data: orcamento } = useGetOrcamento({ ano: currentYear });

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-cidade.png`} 
            alt="Visão panorâmica da cidade" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/50 text-white backdrop-blur-md text-sm font-semibold mb-6 tracking-wide uppercase">
              Bem-vindo ao Portal Oficial
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-serif drop-shadow-lg">
              Transparência, Inovação e Serviço ao Cidadão.
            </h1>
            <p className="text-lg md:text-xl text-zinc-200 mb-10 leading-relaxed max-w-xl">
              Acesse serviços digitais, acompanhe as contas públicas e fique por dentro de tudo que acontece no nosso município.
            </p>
            
            {/* Quick Search in Hero */}
            <form className="relative max-w-xl group bg-white p-2 rounded-2xl shadow-2xl flex focus-within:ring-4 focus-within:ring-primary/50 transition-all">
              <div className="pl-4 pr-2 py-3 text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                className="w-full bg-transparent text-zinc-900 placeholder:text-zinc-500 focus:outline-none text-lg"
                placeholder="O que você procura hoje?"
                aria-label="Buscar serviços e informações"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                Buscar
              </button>
            </form>
          </div>
        </div>
        
        {/* Decorative Wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-[1px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-background">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 60C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* QUICK ACCESS / SERVIÇOS */}
      <section className="py-16 md:py-24 bg-background relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Acesso Rápido</h2>
              <p className="text-muted-foreground text-lg">Os serviços mais procurados pelos cidadãos.</p>
            </div>
            <Link href="/servicos" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline">
              Ver todos os serviços <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Static Quick Icons - commonly needed in Gov portals */}
            {[
              { title: "Nota Fiscal", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
              { title: "IPTU / IPTU", icon: Landmark, color: "text-green-600", bg: "bg-green-100" },
              { title: "Diário Oficial", icon: FileBarChart, color: "text-purple-600", bg: "bg-purple-100" },
              { title: "Portal do Servidor", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
              { title: "Agendamentos", icon: CalendarDays, color: "text-rose-600", bg: "bg-rose-100" },
              { title: "Ouvidoria", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
            ].map((item, i) => (
              <a 
                key={i} 
                href="#" 
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
              </a>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/servicos" className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/10 px-6 py-3 rounded-xl">
              Ver todos os serviços <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS: NEWS & TRANSPARENCY */}
      <section className="py-16 md:py-24 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LATEST NEWS */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3 font-serif">Últimas Notícias</h2>
                <div className="w-16 h-1.5 bg-primary rounded-full"></div>
              </div>
              <Link href="/noticias" className="text-primary font-semibold hover:underline hidden sm:block">
                Ver todas
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingNoticias ? (
                // Skeletons
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden border border-border">
                    <div className="h-48 bg-muted w-full"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-6 bg-muted rounded w-full"></div>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : noticiasData?.data && noticiasData.data.length > 0 ? (
                noticiasData.data.slice(0,2).map((noticia) => (
                  <Link 
                    key={noticia.id} 
                    href={`/noticias/${noticia.slug}`}
                    className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {/* placeholder stock image if no thumb */}
                      {/* landing page recent news thumbnail */}
                      <img 
                        src={noticia.imagemCapa || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80"} 
                        alt={noticia.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                        {noticia.categoria}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <time className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(noticia.dataPublicacao)}
                      </time>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {noticia.resumo}
                      </p>
                      <span className="text-primary font-semibold flex items-center gap-2 mt-auto">
                        Leia mais <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-card rounded-2xl border border-dashed border-border text-muted-foreground">
                  Nenhuma notícia em destaque no momento.
                </div>
              )}
            </div>
          </div>

          {/* TRANSPARENCY WIDGET */}
          <div className="lg:col-span-4">
             <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 font-serif">Transparência</h2>
                <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
              </div>
              
              <div className="bg-secondary rounded-2xl p-8 text-secondary-foreground shadow-xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <h3 className="text-2xl font-bold mb-2">Orçamento {currentYear}</h3>
                <p className="text-secondary-foreground/80 mb-8 text-sm">Acompanhe a aplicação dos recursos públicos em tempo real (LAI).</p>
                
                <div className="space-y-6 relative z-10">
                  <div className="bg-black/20 p-5 rounded-xl border border-white/10">
                    <span className="block text-sm font-medium text-white/80 mb-1 uppercase tracking-wide">Receita Prevista</span>
                    <span className="block text-3xl font-bold">{orcamento ? formatCurrency(orcamento.receitaPrevista) : 'R$ ---'}</span>
                  </div>
                  
                  <div className="bg-black/20 p-5 rounded-xl border border-white/10">
                    <span className="block text-sm font-medium text-white/80 mb-1 uppercase tracking-wide">Despesa Realizada</span>
                    <span className="block text-3xl font-bold">{orcamento ? formatCurrency(orcamento.despesaRealizada) : 'R$ ---'}</span>
                  </div>
                </div>

                <Link 
                  href="/transparencia" 
                  className="mt-8 w-full block text-center bg-white text-secondary font-bold py-3.5 rounded-xl hover:bg-zinc-100 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Acessar Portal da Transparência
                </Link>
              </div>
          </div>

        </div>
      </section>

    </Layout>
  );
}
