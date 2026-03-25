import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight, Images, ZoomIn } from "lucide-react";
import { useListGaleria } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  "https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?w=600&q=80",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=80",
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
];

// Lightbox
interface LightboxProps {
  images: Array<{ url: string; legenda?: string | null }>;
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [idx, setIdx] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { closeRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  const img = images[idx];
  if (!img) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${idx + 1} de ${images.length}${img.legenda ? `: ${img.legenda}` : ""}`}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Fechar lightbox"
      >
        <X className="w-6 h-6" aria-hidden="true" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="w-6 h-6" aria-hidden="true" />
      </button>

      <div className="max-w-4xl max-h-[80vh] mx-auto px-16" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={img.url}
            alt={img.legenda ?? `Foto ${idx + 1}`}
            className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
        {img.legenda && (
          <p className="text-center text-white/70 text-sm mt-4">{img.legenda}</p>
        )}
        <p className="text-center text-white/40 text-xs mt-2">{idx + 1} / {images.length}</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Próxima imagem"
      >
        <ChevronRight className="w-6 h-6" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

// Masonry-like grid heights
const HEIGHTS = ["h-48", "h-64", "h-40", "h-56", "h-48", "h-64"];

export function GaleriaSection() {
  const { data, isLoading } = useListGaleria({ limit: 6 });
  const [lightbox, setLightbox] = useState<{ images: Array<{ url: string; legenda?: string | null }>; idx: number } | null>(null);

  const allAlbums = data?.data ?? [];

  // Gather first photo from each album or use placeholder
  const photos = allAlbums.slice(0, 6).map((album, i) => ({
    url: album.thumbnail ?? album.fotos[0]?.url ?? PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]!,
    legenda: album.titulo,
    albumFotos: album.fotos.length > 0 ? album.fotos : [{ url: PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]!, legenda: album.titulo }],
  }));

  // If no data yet, show placeholders
  const displayPhotos = photos.length > 0 ? photos : PLACEHOLDER_IMGS.map((url, i) => ({
    url,
    legenda: `Foto ${i + 1}`,
    albumFotos: [{ url, legenda: `Foto ${i + 1}` }],
  }));

  return (
    <>
      <section aria-labelledby="galeria-heading" className="py-14 sm:py-20 bg-muted/30 border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Registro Municipal</p>
              <h2 id="galeria-heading" className="text-2xl sm:text-3xl font-black text-foreground">
                Galeria de Fotos
              </h2>
              <div className="w-12 h-1.5 bg-accent rounded-full mt-2" aria-hidden="true" />
            </div>
            <Link
              href="/galeria"
              className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline focus:outline-none focus:underline text-sm"
            >
              Ver galeria completa <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className={cn("animate-pulse bg-muted rounded-2xl", HEIGHTS[i % HEIGHTS.length])} />
              ))}
            </div>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              aria-label="Galeria de fotos recentes"
            >
              {displayPhotos.map((photo, i) => (
                <li key={i} className={cn(HEIGHTS[i % HEIGHTS.length])}>
                  <button
                    onClick={() => setLightbox({ images: photo.albumFotos, idx: 0 })}
                    className="group relative w-full h-full rounded-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-primary/40 block"
                    aria-label={`Ver foto: ${photo.legenda}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.legenda ?? `Foto ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-focus:bg-black/30 transition-colors duration-200 flex items-center justify-center" aria-hidden="true">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
                    </div>
                    {photo.legenda && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium line-clamp-1">{photo.legenda}</p>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
            >
              <Images className="w-4 h-4" aria-hidden="true" />
              Ver galeria completa
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.idx}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
