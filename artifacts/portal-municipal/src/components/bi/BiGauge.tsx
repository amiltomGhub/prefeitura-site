import { cn } from "@/lib/utils";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  size?: number;
  thresholds?: { warning: number; critical: number };
  invertThresholds?: boolean;
}

function getColor(pct: number, thresholds?: { warning: number; critical: number }, inverted?: boolean) {
  if (!thresholds) return "#3B82F6";
  if (inverted) {
    if (pct <= thresholds.warning) return "#22C55E";
    if (pct <= thresholds.critical) return "#F59E0B";
    return "#EF4444";
  } else {
    if (pct >= thresholds.critical) return "#22C55E";
    if (pct >= thresholds.warning) return "#F59E0B";
    return "#EF4444";
  }
}

export function BiGauge({ value, max = 100, label, sublabel, size = 120, thresholds, invertThresholds }: GaugeProps) {
  const pct = Math.min(100, (value / max) * 100);
  const color = getColor(pct, thresholds, invertThresholds);
  const data = [{ value: pct }];

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="65%" outerRadius="90%"
            data={data}
            startAngle={220} endAngle={-40}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              fill={color}
              background={{ fill: "#27272a" }}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
          <span className="text-xl font-black text-white tabular-nums leading-none">{value.toFixed(1)}<span className="text-sm text-zinc-400">%</span></span>
          {thresholds && <span className="text-[9px] text-zinc-600">limite {max}%</span>}
        </div>
      </div>
      <p className="text-xs font-semibold text-zinc-300 text-center leading-tight max-w-[110px]">{label}</p>
      {sublabel && <p className="text-[10px] text-zinc-600 text-center">{sublabel}</p>}
      <div className={cn("w-2 h-2 rounded-full", color === "#22C55E" ? "bg-green-400" : color === "#F59E0B" ? "bg-yellow-400" : "bg-red-400")} />
    </div>
  );
}

// ─── Progress bar gauge ───────────────────────────────────────────────────────
export function BiProgressGauge({ label, value, max, color = "#3B82F6", showPct = true }: { label: string; value: number; max: number; color?: string; showPct?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
        {showPct && <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct.toFixed(1)}%</span>}
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
