import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

// Public pages
import Home from "@/pages/Home";
import TransparenciaHub from "@/pages/TransparenciaHub";
import Noticias from "@/pages/Noticias";
import Servicos from "@/pages/Servicos";
import Municipio from "@/pages/Municipio";
import NotFound from "@/pages/not-found";

// Transparência sub-pages
import Orcamento from "@/pages/transparencia/Orcamento";
import Despesas from "@/pages/transparencia/Despesas";
import Receitas from "@/pages/transparencia/Receitas";
import Licitacoes from "@/pages/transparencia/Licitacoes";
import Servidores from "@/pages/transparencia/Servidores";
import Legislacao from "@/pages/transparencia/Legislacao";
import Sic from "@/pages/transparencia/Sic";
import DadosAbertos from "@/pages/transparencia/DadosAbertos";

// CMS pages
import CmsDashboard from "@/pages/cms/CmsDashboard";
import CmsNoticias from "@/pages/cms/CmsNoticias";
import CmsNoticiaEditor from "@/pages/cms/CmsNoticiaEditor";
import CmsPaginas from "@/pages/cms/CmsPaginas";
import CmsBanners from "@/pages/cms/CmsBanners";
import CmsAgenda from "@/pages/cms/CmsAgenda";
import CmsGaleria from "@/pages/cms/CmsGaleria";
import CmsTransparenciaCms from "@/pages/cms/CmsTransparenciaCms";
import CmsLegislacaoCms from "@/pages/cms/CmsLegislacaoCms";
import CmsLicitacoesCms from "@/pages/cms/CmsLicitacoesCms";
import CmsServicos from "@/pages/cms/CmsServicos";
import CmsSecretarias from "@/pages/cms/CmsSecretarias";
import CmsMenus from "@/pages/cms/CmsMenus";
import CmsAparencia from "@/pages/cms/CmsAparencia";
import CmsUsuarios from "@/pages/cms/CmsUsuarios";
import CmsConfiguracoes from "@/pages/cms/CmsConfiguracoes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* ─────────────────────────────────────────
          Portal Público
      ───────────────────────────────────────── */}
      <Route path="/" component={Home} />

      {/* Transparência hub + sub-pages */}
      <Route path="/transparencia" component={TransparenciaHub} />
      <Route path="/transparencia/orcamento" component={Orcamento} />
      <Route path="/transparencia/despesas" component={Despesas} />
      <Route path="/transparencia/receitas" component={Receitas} />
      <Route path="/transparencia/licitacoes" component={Licitacoes} />
      <Route path="/transparencia/servidores" component={Servidores} />
      <Route path="/transparencia/legislacao" component={Legislacao} />
      <Route path="/transparencia/sic" component={Sic} />
      <Route path="/transparencia/dados-abertos" component={DadosAbertos} />

      {/* Standalone aliases */}
      <Route path="/licitacoes" component={Licitacoes} />
      <Route path="/legislacao" component={Legislacao} />

      {/* Other public pages */}
      <Route path="/noticias" component={Noticias} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/municipio" component={Municipio} />
      <Route path="/governo" component={Municipio} />
      <Route path="/governo/secretarias" component={Municipio} />

      {/* ─────────────────────────────────────────
          CMS — Painel Administrativo
          Acesso via /site-admin/*
      ───────────────────────────────────────── */}

      {/* Redirect /site-admin → /site-admin/dashboard */}
      <Route path="/site-admin">
        {() => <Redirect to="/site-admin/dashboard" />}
      </Route>

      {/* Dashboard */}
      <Route path="/site-admin/dashboard" component={CmsDashboard} />

      {/* Notícias */}
      <Route path="/site-admin/noticias" component={CmsNoticias} />
      <Route path="/site-admin/noticias/nova" component={CmsNoticiaEditor} />
      <Route path="/site-admin/noticias/:id/editar" component={CmsNoticiaEditor} />

      {/* Páginas estáticas */}
      <Route path="/site-admin/paginas" component={CmsPaginas} />
      <Route path="/site-admin/paginas/nova" component={CmsPaginas} />
      <Route path="/site-admin/paginas/:id/editar" component={CmsPaginas} />

      {/* Banners / Carrossel */}
      <Route path="/site-admin/banners" component={CmsBanners} />

      {/* Agenda */}
      <Route path="/site-admin/agenda" component={CmsAgenda} />

      {/* Galeria */}
      <Route path="/site-admin/galeria" component={CmsGaleria} />

      {/* Transparência CMS (LAI compliance) */}
      <Route path="/site-admin/transparencia" component={CmsTransparenciaCms} />

      {/* Legislação CMS */}
      <Route path="/site-admin/legislacao" component={CmsLegislacaoCms} />

      {/* Licitações CMS */}
      <Route path="/site-admin/licitacoes" component={CmsLicitacoesCms} />

      {/* Serviços CMS */}
      <Route path="/site-admin/servicos" component={CmsServicos} />

      {/* Secretarias CMS */}
      <Route path="/site-admin/secretarias" component={CmsSecretarias} />

      {/* Menus */}
      <Route path="/site-admin/menus" component={CmsMenus} />

      {/* Aparência */}
      <Route path="/site-admin/aparencia" component={CmsAparencia} />

      {/* Usuários */}
      <Route path="/site-admin/usuarios" component={CmsUsuarios} />

      {/* Configurações */}
      <Route path="/site-admin/configuracoes" component={CmsConfiguracoes} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
