import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useListNoticias } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { Search, CalendarDays, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Noticias() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useListNoticias({ limit: 12 });

  const filteredNoticias = data?.data?.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.resumo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-foreground">Notícias</h1>
          
          <div className="max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-zinc-950 border-2 border-border rounded-xl leading-5 placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg shadow-sm"
              placeholder="Pesquisar notícias, comunicados..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden border border-border">
                <div className="h-48 bg-muted w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-6 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNoticias && filteredNoticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNoticias.map((noticia) => (
              <Link 
                key={noticia.id} 
                href={`/noticias/${noticia.slug}`}
                className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={noticia.imagemCapa || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"} 
                    alt={noticia.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-md">
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
                  <span className="text-primary font-semibold flex items-center gap-1 mt-auto">
                    Continuar lendo <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
            <h3 className="text-2xl font-bold text-foreground mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-muted-foreground">Tente buscar por termos diferentes ou volte mais tarde.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
