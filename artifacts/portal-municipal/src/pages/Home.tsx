import { Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { QuickServicesSection } from "@/components/home/QuickServicesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { AgendaSection } from "@/components/home/AgendaSection";
import { MunicipioNumbers } from "@/components/home/MunicipioNumbers";
import { TransparenciaHighlight } from "@/components/home/TransparenciaHighlight";
import { GaleriaSection } from "@/components/home/GaleriaSection";
import { SecretariasSection } from "@/components/home/SecretariasSection";
import { CanaisSection } from "@/components/home/CanaisSection";
import { FloatingContact } from "@/components/home/FloatingContact";

function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-muted animate-pulse`} aria-hidden="true" />
  );
}

export default function Home() {
  return (
    <Layout>
      {/* 1. Hero Carousel — carrossel com autoplay, pausa no hover/foco, WCAG 2.2.2 */}
      <Suspense fallback={<SectionSkeleton height="h-[420px] sm:h-[520px] lg:h-[620px]" />}>
        <HeroCarousel />
      </Suspense>

      {/* 2. Serviços Rápidos — 8 ícones animados ao scroll */}
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <QuickServicesSection />
      </Suspense>

      {/* 3. Notícias em Destaque — 1 principal + 3 secundárias */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <NewsSection />
      </Suspense>

      {/* 4. Agenda da Prefeitura — próximos eventos + mini calendário */}
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <AgendaSection />
      </Suspense>

      {/* 5. Números do Município — contadores animados */}
      <Suspense fallback={<SectionSkeleton height="h-56" />}>
        <MunicipioNumbers />
      </Suspense>

      {/* 6. Portal da Transparência — OBRIGATÓRIO LAI (não pode ser desativado) */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <TransparenciaHighlight />
      </Suspense>

      {/* 7. Galeria de Fotos — grid masonry com lightbox acessível */}
      <Suspense fallback={<SectionSkeleton height="h-72" />}>
        <GaleriaSection />
      </Suspense>

      {/* 8. Secretarias Municipais — grid com busca inline */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <SecretariasSection />
      </Suspense>

      {/* 9. Canais de Comunicação — CTA final */}
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <CanaisSection />
      </Suspense>

      {/* 10. Widget flutuante "Fale Conosco" */}
      <FloatingContact />
    </Layout>
  );
}
