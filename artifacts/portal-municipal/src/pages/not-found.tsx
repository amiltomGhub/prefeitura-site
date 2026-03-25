import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Página não encontrada</h1>
          <p className="text-lg text-muted-foreground mb-8">
            O conteúdo que você está procurando pode ter sido removido, renomeado ou está temporariamente indisponível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Voltar ao Início
            </Link>
            <Link 
              href="/busca" 
              className="px-6 py-3 bg-card border-2 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-4 focus:ring-muted-foreground/20"
            >
              Fazer uma busca
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
