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
      <Route path="/" component={Home} />
      <Route path="/transparencia" component={TransparenciaHub} />
      <Route path="/noticias" component={Noticias} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/municipio" component={Municipio} />
      
      {/* 
        Other routes mapped to placeholders or home for now to ensure completeness of core flows
        In a full build, we'd add separate files for these.
      */}
      <Route path="/governo" component={Municipio} />
      <Route path="/licitacoes" component={TransparenciaHub} />
      
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
