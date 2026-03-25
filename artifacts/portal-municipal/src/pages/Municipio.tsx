import { Layout } from "@/components/layout/Layout";
import { useGetMunicipioInfo } from "@workspace/api-client-react";
import { Map, Users, TrendingUp, Mountain } from "lucide-react";

export default function Municipio() {
  const { data: info, isLoading } = useGetMunicipioInfo();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner for city */}
      <div className="relative h-64 md:h-96 w-full bg-zinc-900 overflow-hidden">
        {/* landing page city history banner */}
        <img 
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80" 
          alt="Vista da cidade" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white font-serif drop-shadow-lg mb-4">
            O Município
          </h1>
          <p className="text-xl text-zinc-200 max-w-2xl drop-shadow-md">
            Conheça nossa história, dados geográficos e símbolos oficiais.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
        
        {/* Key Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">População</h3>
            <p className="text-2xl font-bold text-foreground">{info?.populacao?.toLocaleString('pt-BR') || "---"}</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Área</h3>
            <p className="text-2xl font-bold text-foreground">{info?.area?.toLocaleString('pt-BR')} km²</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">IDH</h3>
            <p className="text-2xl font-bold text-foreground">{info?.idh || "0.---"}</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Altitude</h3>
            <p className="text-2xl font-bold text-foreground">{info?.altitude || "---"} m</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* History */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card p-8 md:p-10 rounded-3xl shadow-sm border border-border">
              <h2 className="text-3xl font-bold font-serif mb-6 text-foreground border-b-2 border-primary/20 pb-4 inline-block">Nossa História</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {info?.historia ? (
                  <p>{info.historia}</p>
                ) : (
                  <p>A história do município é marcada por sua fundação forte e desenvolvimento contínuo. Inicialmente habitada por povos originários e posteriormente colonizada durante o ciclo econômico principal da região, a cidade cresceu ao redor de suas atividades comerciais e agrícolas, tornando-se hoje um polo importante para o estado.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Symbols */}
          <div className="space-y-8">
            <section className="bg-secondary text-secondary-foreground p-8 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-bold font-serif mb-8 text-center border-b border-white/20 pb-4">Símbolos Oficiais</h2>
              
              <div className="space-y-8 text-center">
                <div>
                  <h3 className="font-semibold mb-4 text-white/80">Brasão</h3>
                  <div className="bg-white p-6 rounded-2xl shadow-inner inline-block">
                    {info?.simbolos?.brasao ? (
                      <img src={info.simbolos.brasao} alt="Brasão" className="w-32 h-32 object-contain" />
                    ) : (
                      <img src={`${import.meta.env.BASE_URL}images/brasao.png`} alt="Brasão do Município" className="w-32 h-32 object-contain" />
                    )}
                  </div>
                </div>

                {info?.simbolos?.bandeira && (
                   <div>
                    <h3 className="font-semibold mb-4 text-white/80">Bandeira</h3>
                    <div className="bg-white p-2 rounded-xl shadow-inner inline-block">
                      <img src={info.simbolos.bandeira} alt="Bandeira" className="w-48 h-auto object-contain rounded" />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

      </div>
    </Layout>
  );
}
