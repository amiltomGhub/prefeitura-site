import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useListServicos } from "@workspace/api-client-react";
import { Search, ChevronRight, CheckCircle2, Globe, Building } from "lucide-react";
import { useState } from "react";

export default function Servicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useListServicos({ limit: 50 });

  const filteredServicos = data?.data?.filter(s => 
    s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedServicos = filteredServicos?.reduce((acc, servico) => {
    if (!acc[servico.categoria]) acc[servico.categoria] = [];
    acc[servico.categoria].push(servico);
    return acc;
  }, {} as Record<string, typeof filteredServicos>);

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Carta de Serviços</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Encontre aqui todos os serviços prestados pela Prefeitura. Pesquise por palavra-chave ou navegue pelas categorias.
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white text-zinc-900 rounded-xl leading-5 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-lg shadow-xl"
                placeholder="Ex: Emissão de IPTU, Alvará, IPTU..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="space-y-8">
             <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl"></div>)}
             </div>
          </div>
        ) : groupedServicos && Object.keys(groupedServicos).length > 0 ? (
          <div className="space-y-16">
            {Object.entries(groupedServicos).map(([categoria, servicos]) => (
              <div key={categoria}>
                <h2 className="text-2xl font-bold text-foreground mb-8 pb-4 border-b-2 border-border flex items-center gap-3">
                  <div className="w-2 h-8 bg-secondary rounded-full"></div>
                  {categoria}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicos.map(servico => (
                    <Link 
                      key={servico.id}
                      href={`/servicos/${servico.slug}`}
                      className="bg-card border border-border hover:border-primary rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group focus:outline-none focus:ring-4 focus:ring-primary/20 flex flex-col h-full"
                    >
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {servico.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                        {servico.descricao}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <div className="flex gap-3">
                          {servico.online ? (
                            <span title="Serviço Online" className="text-blue-600 bg-blue-100 p-1.5 rounded-md"><Globe className="w-4 h-4"/></span>
                          ) : (
                            <span title="Presencial" className="text-orange-600 bg-orange-100 p-1.5 rounded-md"><Building className="w-4 h-4"/></span>
                          )}
                          {servico.gratuito && (
                            <span title="Gratuito" className="text-green-600 bg-green-100 p-1.5 rounded-md"><CheckCircle2 className="w-4 h-4"/></span>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-muted-foreground">Nenhum serviço encontrado para sua busca.</h3>
          </div>
        )}
      </div>
    </Layout>
  );
}
