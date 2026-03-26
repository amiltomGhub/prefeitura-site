import { ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

interface SparkProps {
  data: { d?: number; v: number }[];
  color?: string;
  type?: "line" | "area";
  h?: number;
}

export function BiSparkline({ data, color = "#3B82F6", type = "line", h = 32 }: SparkProps) {
  if (type === "area") {
    return (
      <ResponsiveContainer width={64} height={h}>
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area dataKey="v" stroke={color} fill={`url(#sg-${color})`} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width={64} height={h}>
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
