import { useState } from "react";
import { Link } from "wouter";
import { CalendarDays, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useListAgenda } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  reuniao: { bg: "bg-blue-100", text: "text-blue-700" },
  evento: { bg: "bg-purple-100", text: "text-purple-700" },
  "audiencia-publica": { bg: "bg-orange-100", text: "text-orange-700" },
  licitacao: { bg: "bg-green-100", text: "text-green-700" },
};

function catStyle(cat: string | null | undefined) {
  return CAT_COLORS[cat?.toLowerCase() ?? ""] ?? { bg: "bg-zinc-100", text: "text-zinc-700" };
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("pt-BR", { day: "2-digit" }),
    month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

// Mini Calendar
function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm" aria-label="Calendário do mês">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <h3 className="text-sm font-bold text-foreground capitalize">{monthName}</h3>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-1">
        {["D","S","T","Q","Q","S","S"].map((d, i) => (
          <span key={i} className="py-1 text-muted-foreground font-semibold" aria-hidden="true">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {cells.map((day, i) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={i}
              className={cn(
                "py-1.5 rounded-md text-xs",
                day === null && "invisible",
                isToday && "bg-primary text-white font-bold",
                day !== null && !isToday && "text-foreground hover:bg-muted transition-colors"
              )}
              aria-label={day ? `${day} de ${monthName}${isToday ? " (hoje)" : ""}` : undefined}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Hoje: {today.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
        </p>
      </div>
    </div>
  );
}

export function AgendaSection() {
  const { data, isLoading } = useListAgenda({ limit: 5 });
  const eventos = data?.data ?? [];

  return (
    <section aria-labelledby="agenda-heading" className="py-14 sm:py-20 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Calendário Municipal</p>
            <h2 id="agenda-heading" className="text-2xl sm:text-3xl font-black text-foreground">
              Agenda da Prefeitura
            </h2>
            <div className="w-12 h-1.5 bg-accent rounded-full mt-2" aria-hidden="true" />
          </div>
          <Link
            href="/agenda"
            className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline focus:outline-none focus:underline text-sm"
          >
            Ver agenda completa <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Events list */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <ul className="space-y-4" role="list">
                {Array(4).fill(0).map((_, i) => (
                  <li key={i} className="animate-pulse flex gap-4 p-4 bg-card border border-border rounded-2xl">
                    <div className="w-16 h-16 bg-muted rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : eventos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-border bg-card text-muted-foreground gap-3">
                <CalendarDays className="w-10 h-10 opacity-30" aria-hidden="true" />
                <p className="text-sm">Nenhum evento próximo na agenda.</p>
              </div>
            ) : (
              <ul className="space-y-3" role="list" aria-label="Próximos eventos">
                {eventos.map((evento) => {
                  const date = formatEventDate(evento.dataInicio);
                  const style = catStyle(evento.categoria);
                  return (
                    <li key={evento.id}>
                      <article className="group flex gap-4 p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200">
                        {/* Date badge */}
                        <div className="flex-shrink-0 w-16 h-16 bg-primary/5 border border-primary/20 rounded-xl flex flex-col items-center justify-center text-primary">
                          <span className="text-xl font-black leading-none" aria-hidden="true">{date.day}</span>
                          <span className="text-[11px] font-semibold uppercase" aria-hidden="true">{date.month}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            {evento.categoria && (
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase", style.bg, style.text)}>
                                {evento.categoria.replace("-", " ")}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground capitalize">{date.weekday}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                            {evento.titulo}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {evento.local && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                                {evento.local}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              <time dateTime={evento.dataInicio}>{date.time}</time>
                            </span>
                            {evento.gratuito && (
                              <span className="text-green-600 font-semibold">Gratuito</span>
                            )}
                          </div>
                        </div>

                        {evento.linkInscricao && (
                          <a
                            href={evento.linkInscricao}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex self-center flex-shrink-0 text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={`Inscrever-se em ${evento.titulo}`}
                          >
                            Inscrever-se
                          </a>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-5">
              <Link
                href="/agenda"
                className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary/5 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm"
              >
                <CalendarDays className="w-4 h-4" aria-hidden="true" />
                Ver agenda completa
              </Link>
            </div>
          </div>

          {/* Mini calendar — desktop only */}
          <div className="hidden lg:block lg:col-span-4">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}
