"use client";

import {
  formatFeatureName,
  getRiskConfig,
  PredictionApiResponse,
  ShapInsightFactor,
} from "@/types/prediction";

interface Props {
  result: PredictionApiResponse;
}

export default function ResultSection({ result }: Props) {
  const prediction = result.prediction;
  const insights = result.insights ?? {
    top_driving_factors: [],
    top_reducing_factors: [],
  };
  const cfg = getRiskConfig(prediction.risk_level);

  const probabilities = [
    { label: "risk_score_0", title: "Low Risk", value: prediction.risk_score_0, color: "bg-emerald-500" },
    { label: "risk_score_1", title: "Medium Risk", value: prediction.risk_score_1, color: "bg-amber-500" },
    { label: "risk_score_2", title: "High Risk", value: prediction.risk_score_2, color: "bg-rose-500" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <div className={`rounded-3xl border p-6 ${cfg.bgClass} ${cfg.borderClass}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Prediction Result
            </p>
            <h3 className={`mt-3 text-6xl font-black tracking-tight ${cfg.textClass}`}>
              {roundScore(prediction.risk_score_percentage)}%
            </h3>
            <p className={`mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-black ${cfg.textClass}`}>
              {cfg.label}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">API Status</p>
            <p className="mt-1 text-sm font-black text-slate-950">{result.status}</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-700">{cfg.summary}</p>

        <div className="mt-6 grid gap-3">
          {probabilities.map((item) => {
            const percent = item.value * 100;
            return (
              <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-black text-slate-900">{item.title}</p>
                    <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                  </div>
                  <p className="font-black text-slate-950">{percent.toFixed(2)}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${clamp(percent, 0, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FactorPanel
          title="Top Driving Factors"
          description="Factors increasing predicted diabetes risk"
          factors={insights.top_driving_factors}
          tone="risk"
        />
        <FactorPanel
          title="Top Reducing Factors"
          description="Factors reducing predicted diabetes risk"
          factors={insights.top_reducing_factors}
          tone="protective"
        />
      </div>
    </div>
  );
}

function FactorPanel({
  title,
  description,
  factors,
  tone,
}: {
  title: string;
  description: string;
  factors: ShapInsightFactor[];
  tone: "risk" | "protective";
}) {
  const maxImpact = Math.max(...factors.map((factor) => Math.abs(factor.impact_score)), 1);
  const color = tone === "risk" ? "bg-rose-500" : "bg-emerald-500";
  const textColor = tone === "risk" ? "text-rose-700" : "text-emerald-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{description}</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">{title}</h3>
      <div className="mt-5 grid gap-3">
        {factors.length ? (
          factors.map((factor) => {
            const width = (Math.abs(factor.impact_score) / maxImpact) * 100;
            return (
              <div key={`${factor.feature}-${factor.impact_score}`} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">{formatFeatureName(factor.feature)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Value: {formatFactorValue(factor.value)}</p>
                  </div>
                  <p className={`text-sm font-black ${textColor}`}>{factor.impact_score.toFixed(4)}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${clamp(width, 4, 100)}%` }} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm font-semibold text-slate-500">
            No SHAP factors returned.
          </div>
        )}
      </div>
    </div>
  );
}

function roundScore(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function formatFactorValue(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(4)).toString() : "--";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
