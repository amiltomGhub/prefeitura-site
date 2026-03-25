import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

// Pages
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
      {/* Home */}
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

      {/* Licitações standalone (mapped from navbar) */}
      <Route path="/licitacoes" component={Licitacoes} />

      {/* Legislação standalone */}
      <Route path="/legislacao" component={Legislacao} />

      {/* Other pages */}
      <Route path="/noticias" component={Noticias} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/municipio" component={Municipio} />
      <Route path="/governo" component={Municipio} />
      <Route path="/governo/secretarias" component={Municipio} />

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
