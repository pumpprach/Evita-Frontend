// components/predict/ResultSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { PredictionResult, getRiskLevel, RISK_CONFIG } from "@/types/prediction";
import ShapList from "./ShapList";
import ShapChart from "@/components/charts/ShapChart";

interface Props {
  result: PredictionResult;
}

export default function ResultSection({ result }: Props) {
  const { risk_score, top_factors } = result;
  const level = getRiskLevel(risk_score);
  const cfg = RISK_CONFIG[level];
  const arcRef = useRef<SVGCircleElement>(null);

  const CIRC = 2 * Math.PI * 70; // ~440

  useEffect(() => {
    if (!arcRef.current) return;
    const dash = (CIRC * risk_score) / 100;
    arcRef.current.style.setProperty("--dash", `${dash.toFixed(1)}`);
    arcRef.current.setAttribute("stroke-dasharray", `${dash.toFixed(1)} ${CIRC.toFixed(1)}`);
  }, [risk_score]);

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Gauge + SHAP chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gauge */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6">
          <h3 className="font-semibold text-slate-200 mb-4">
            <span className="mr-2">🎯</span>AI Prediction Result
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="70" fill="none" stroke="#1e293b" strokeWidth="14" />
                <circle
                  ref={arcRef}
                  cx="90" cy="90" r="70"
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth="14"
                  strokeDasharray="0 440"
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1.2s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: cfg.color }}>{risk_score}%</span>
                <span className="text-sm font-medium mt-0.5" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>

            {/* Level badges */}
            <div className="flex gap-2 mt-4">
              {(["low","medium","high"] as const).map((l) => (
                <span
                  key={l}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    l === level
                      ? "bg-slate-700 border-slate-500 text-white font-semibold"
                      : "border-slate-700 text-slate-500"
                  }`}
                >
                  {l === "low" ? "Low <40%" : l === "medium" ? "Medium 40–70%" : "High >70%"}
                </span>
              ))}
            </div>

            {/* Advice box */}
            <div className={`mt-5 w-full p-4 rounded-xl border ${cfg.bgClass} ${cfg.borderClass}`}>
              <p className={`text-sm font-semibold mb-1 ${cfg.titleColor}`}>{cfg.title}</p>
              <p className={`text-xs leading-relaxed ${cfg.textColor}`}>{cfg.advice}</p>
            </div>
          </div>
        </div>

        {/* SHAP Chart */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6">
          <h3 className="font-semibold text-slate-200 mb-4">
            <span className="mr-2">📊</span>Explainable AI — Feature Importance
          </h3>
          <ShapChart factors={top_factors} />
        </div>
      </div>

      {/* Row 2: SHAP list */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6">
        <h3 className="font-semibold text-slate-200 mb-4">
          <span className="mr-2">🔬</span>Factors Affecting Prediction
        </h3>
        <ShapList factors={top_factors} />
      </div>
    </div>
  );
}
