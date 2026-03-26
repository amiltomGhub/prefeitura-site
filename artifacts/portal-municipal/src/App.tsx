import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ServidorProvider } from "@/contexts/ServidorContext";
import { BiProvider } from "@/contexts/BiContext";

// BI pages
import BiCockpit from "@/pages/bi/BiCockpit";
import BiOuvidoria from "@/pages/bi/BiOuvidoria";
import BiFinanceiro from "@/pages/bi/BiFinanceiro";
import BiPessoal from "@/pages/bi/BiPessoal";
import BiObras from "@/pages/bi/BiObras";
import BiSocial from "@/pages/bi/BiSocial";
import BiTv from "@/pages/bi/BiTv";

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

// Portal do Servidor
import ContrachequeListagem from "@/pages/servidor/ContrachequeListagem";
import ContrachequeDetalhe from "@/pages/servidor/ContrachequeDetalhe";
import Ferias from "@/pages/servidor/Ferias";
import FeriasSolicitar from "@/pages/servidor/FeriasSolicitar";
import Requerimentos from "@/pages/servidor/Requerimentos";
import RequerimentoNovo from "@/pages/servidor/RequerimentoNovo";
import RequerimentoDetalhe from "@/pages/servidor/RequerimentoDetalhe";
import VidaFuncional from "@/pages/servidor/VidaFuncional";

// Painel RH
import RhDashboard from "@/pages/rh/RhDashboard";
import RhFerias from "@/pages/rh/RhFerias";
import RhRequerimentos from "@/pages/rh/RhRequerimentos";

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
      <Route path="/site-admin">
        {() => <Redirect to="/site-admin/dashboard" />}
      </Route>
      <Route path="/site-admin/dashboard" component={CmsDashboard} />
      <Route path="/site-admin/noticias" component={CmsNoticias} />
      <Route path="/site-admin/noticias/nova" component={CmsNoticiaEditor} />
      <Route path="/site-admin/noticias/:id/editar" component={CmsNoticiaEditor} />
      <Route path="/site-admin/paginas" component={CmsPaginas} />
      <Route path="/site-admin/paginas/nova" component={CmsPaginas} />
      <Route path="/site-admin/paginas/:id/editar" component={CmsPaginas} />
      <Route path="/site-admin/banners" component={CmsBanners} />
      <Route path="/site-admin/agenda" component={CmsAgenda} />
      <Route path="/site-admin/galeria" component={CmsGaleria} />
      <Route path="/site-admin/transparencia" component={CmsTransparenciaCms} />
      <Route path="/site-admin/legislacao" component={CmsLegislacaoCms} />
      <Route path="/site-admin/licitacoes" component={CmsLicitacoesCms} />
      <Route path="/site-admin/servicos" component={CmsServicos} />
      <Route path="/site-admin/secretarias" component={CmsSecretarias} />
      <Route path="/site-admin/menus" component={CmsMenus} />
      <Route path="/site-admin/aparencia" component={CmsAparencia} />
      <Route path="/site-admin/usuarios" component={CmsUsuarios} />
      <Route path="/site-admin/configuracoes" component={CmsConfiguracoes} />

      {/* ─────────────────────────────────────────
          Portal do Servidor — /servidor/*
      ───────────────────────────────────────── */}
      <Route path="/servidor">
        {() => <Redirect to="/servidor/contracheque" />}
      </Route>

      {/* Contracheque */}
      <Route path="/servidor/contracheque" component={ContrachequeListagem} />
      <Route path="/servidor/contracheque/:mes/:ano" component={ContrachequeDetalhe} />

      {/* Férias */}
      <Route path="/servidor/ferias" component={Ferias} />
      <Route path="/servidor/ferias/solicitar" component={FeriasSolicitar} />

      {/* Requerimentos */}
      <Route path="/servidor/requerimentos" component={Requerimentos} />
      <Route path="/servidor/requerimentos/novo" component={RequerimentoNovo} />
      <Route path="/servidor/requerimentos/:id" component={RequerimentoDetalhe} />

      {/* Vida Funcional */}
      <Route path="/servidor/vida-funcional" component={VidaFuncional} />

      {/* ─────────────────────────────────────────
          Painel RH — /rh/*
      ───────────────────────────────────────── */}
      <Route path="/rh">
        {() => <Redirect to="/rh/dashboard" />}
      </Route>
      <Route path="/rh/dashboard" component={RhDashboard} />
      <Route path="/rh/ferias" component={RhFerias} />
      <Route path="/rh/requerimentos" component={RhRequerimentos} />

      {/* ─────────────────────────────────────────
          Dashboard BI — Sala de Situação — /bi/*
      ───────────────────────────────────────── */}
      <Route path="/bi">
        {() => <Redirect to="/bi/cockpit" />}
      </Route>
      <Route path="/bi/cockpit" component={BiCockpit} />
      <Route path="/bi/ouvidoria" component={BiOuvidoria} />
      <Route path="/bi/financeiro" component={BiFinanceiro} />
      <Route path="/bi/pessoal" component={BiPessoal} />
      <Route path="/bi/obras" component={BiObras} />
      <Route path="/bi/social" component={BiSocial} />
      <Route path="/bi/tv" component={BiTv} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <ServidorProvider>
          <BiProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </BiProvider>
        </ServidorProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
