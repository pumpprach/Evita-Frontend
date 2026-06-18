// components/charts/MiniBarChart.tsx
"use client";

const bars = [30, 45, 60, 38, 72, 55, 82, 48, 65, 90, 44, 58, 35, 70, 50];

function barColor(v: number) {
  if (v > 70) return "#f87171";
  if (v > 45) return "#fbbf24";
  return "#34d399";
}

export default function MiniBarChart() {
  return (
    <div className="mini-bar-chart w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-85 transition-all"
          style={{ height: `${h * 0.85}%`, background: barColor(h) }}
        />
      ))}
    </div>
  );
}
