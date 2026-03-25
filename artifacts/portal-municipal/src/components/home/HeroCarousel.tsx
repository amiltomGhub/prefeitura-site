import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Search } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80",
    title: "Transparência, Inovação e Serviço ao Cidadão",
    subtitle: "Acesse serviços digitais, acompanhe as contas públicas e fique por dentro de tudo que acontece no município.",
    cta: { label: "Acessar Serviços", href: "/servicos" },
    overlay: "from-blue-950/90 via-blue-900/70 to-transparent",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1600&q=80",
    title: "Portal da Transparência",
    subtitle: "Acompanhe o orçamento público, despesas e receitas em conformidade com a Lei de Acesso à Informação (LAI).",
    cta: { label: "Ver Portal da Transparência", href: "/transparencia" },
    overlay: "from-green-950/90 via-green-900/70 to-transparent",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&q=80",
    title: "Serviços Online para o Cidadão",
    subtitle: "Emita documentos, agende atendimentos e acesse serviços municipais sem sair de casa.",
    cta: { label: "Ver Todos os Serviços", href: "/servicos" },
    overlay: "from-purple-950/90 via-purple-900/70 to-transparent",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80",
    title: "Ouvidoria e Participação Cidadã",
    subtitle: "Fale com a Prefeitura, registre reclamações, sugestões e acompanhe o andamento das suas manifestações.",
    cta: { label: "Acessar a Ouvidoria", href: "/ouvidoria" },
    overlay: "from-orange-950/90 via-orange-900/70 to-transparent",
  },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next]);

  // Pause on focus/hover inside
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [prev, next]);

  const slide = SLIDES[current]!;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      ref={containerRef}
      aria-label="Carrossel de destaques"
      aria-roledescription="carrossel"
      className="relative w-full h-[420px] sm:h-[520px] lg:h-[620px] overflow-hidden bg-zinc-900"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
          className="absolute inset-0"
          aria-roledescription="slide"
          aria-label={`Slide ${current + 1} de ${SLIDES.length}: ${slide.title}`}
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading={current === 0 ? "eager" : "lazy"}
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r", slide.overlay)} aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl text-white"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400 mb-4">
                Prefeitura de Parauapebas — PA
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5 drop-shadow-lg font-serif">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-zinc-200 mb-8 leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40 shadow-xl"
                >
                  {slide.cta.label}
                </Link>
                <form
                  onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`; }}
                  className="flex items-center bg-white/10 backdrop-blur border border-white/20 rounded-xl overflow-hidden focus-within:bg-white/20 focus-within:border-white/40 transition-colors"
                >
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar no portal..."
                    className="bg-transparent text-white placeholder-white/60 px-4 py-3.5 text-sm focus:outline-none flex-1 min-w-0"
                    aria-label="Buscar no portal"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3.5 text-white hover:bg-white/10 transition-colors focus:outline-none focus:bg-white/10"
                    aria-label="Buscar"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Dot indicators */}
          <div role="tablist" aria-label="Slides do carrossel" className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white",
                  i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>

          {/* Prev / Pause / Play / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            {/* WCAG 2.2.2: Pause/play obrigatório */}
            <button
              onClick={() => setIsPaused(p => !p)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isPaused ? "Retomar carrossel" : "Pausar carrossel"}
              aria-pressed={isPaused}
            >
              {isPaused
                ? <Play className="w-4 h-4" aria-hidden="true" />
                : <Pause className="w-4 h-4" aria-hidden="true" />
              }
            </button>
            <button
              onClick={next}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-[1px]" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-background">
          <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 30C1200 30 1320 22.5 1380 18.75L1440 15V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
}
