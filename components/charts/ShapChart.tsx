// components/charts/ShapChart.tsx
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ShapFactor } from "@/types/prediction";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  factors: ShapFactor[];
}

export default function ShapChart({ factors }: Props) {
  const top = factors.slice(0, 6);

  const data = {
    labels: top.map((f) => f.label),
    datasets: [
      {
        label: "Impact on Risk",
        data: top.map((f) => (f.positive ? f.value : -f.value)),
        backgroundColor: top.map((f) => (f.positive ? "#e11d48" : "#10b981")),
        borderRadius: 6,
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "#1e293b" },
        ticks: {
          color: "#94a3b8",
          font: { family: "DM Sans", size: 11 },
          callback: (v: number | string) =>
            (Number(v) > 0 ? "+" : "") + v + "%",
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#cbd5e1", font: { family: "DM Sans", size: 12 } },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
