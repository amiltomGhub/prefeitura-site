import { useState } from "react";
import { cn } from "@/lib/utils";
import { BI_BAIRROS } from "@/data/bi-mock";

type Bairro = (typeof BI_BAIRROS)[number];

function getDemandaColor(demandas: number, max: number): string {
  const pct = demandas / max;
  if (pct > 0.8) return "#EF4444";
  if (pct > 0.6) return "#F97316";
  if (pct > 0.4) return "#F59E0B";
  if (pct > 0.2) return "#3B82F6";
  return "#6B7280";
}

interface ChoroplethProps {
  camada?: string;
  onSelectBairro?: (b: Bairro | null) => void;
}

export function BiChoropleth({ onSelectBairro }: ChoroplethProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const maxDemandas = Math.max(...BI_BAIRROS.map((b) => b.demandas));

  const handleClick = (b: Bairro) => {
    const next = selected === b.id ? null : b.id;
    setSelected(next);
    onSelectBairro?.(next ? b : null);
  };

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 320 320" className="w-full h-auto" role="img" aria-label="Mapa de demandas por bairro">
        {BI_BAIRROS.map((b) => {
          const color = getDemandaColor(b.demandas, maxDemandas);
          const isHov = hovered === b.id;
          const isSel = selected === b.id;
          return (
            <g key={b.id}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(b)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${b.nome}: ${b.demandas} demandas`}
            >
              <rect
                x={b.lng} y={b.lat}
                width={b.w} height={b.h}
                rx={8}
                fill={color}
                opacity={isHov ? 0.9 : isSel ? 1 : 0.7}
                stroke={isSel ? "#fff" : isHov ? "#fff" : "transparent"}
                strokeWidth={isSel ? 2 : 1}
              />
              <text
                x={b.lng + b.w / 2} y={b.lat + b.h / 2 - 5}
                textAnchor="middle"
                fill="#fff"
                fontSize={9}
                fontWeight="600"
                fontFamily="system-ui"
                style={{ pointerEvents: "none" }}
              >
                {b.nome}
              </text>
              <text
                x={b.lng + b.w / 2} y={b.lat + b.h / 2 + 9}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize={11}
                fontWeight="800"
                fontFamily="system-ui"
                style={{ pointerEvents: "none" }}
              >
                {b.demandas}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-zinc-900/90 rounded-lg px-2 py-1.5">
        {["#6B7280", "#3B82F6", "#F59E0B", "#F97316", "#EF4444"].map((c, i) => (
          <div key={i} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[9px] text-zinc-500 ml-1">menos → mais</span>
      </div>
    </div>
  );
}
