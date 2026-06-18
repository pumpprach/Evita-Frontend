// components/home/HeroSection.tsx
import Link from "next/link";
import MiniBarChart from "@/components/charts/MiniBarChart";

const stats = [
  { val: "89.4%", label: "Model Accuracy" },
  { val: "10K+", label: "Training Records" },
  { val: "13",   label: "Risk Factors" },
];

const metrics = [
  { val: "89.4%", label: "Accuracy" },
  { val: "87.2%", label: "Precision" },
  { val: "85.9%", label: "Recall" },
  { val: "0.893", label: "AUC-ROC" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pt-16 pb-24 px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* ── Left ── */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI-Powered Health Analysis
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            AI Diabetes
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Risk Prediction
            </span>
          </h1>

          <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
            ประเมินความเสี่ยงโรคเบาหวานด้วยปัญญาประดิษฐ์ แม่นยำ รวดเร็ว และอธิบายผลได้
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/predict"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-xl transition-colors"
            >
              ⚡ เริ่มประเมิน
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-colors"
            >
              ดูข้อมูลเพิ่มเติม
            </Link>
          </div>

          <div className="flex gap-8">
            {stats.map(({ val, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Cards ── */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-sm lg:max-w-none">
          {/* Risk Score Distribution */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur p-5">
            <div className="text-sm font-medium text-slate-300 mb-3">Risk Score Distribution</div>
            <MiniBarChart />
          </div>

          {/* Gauge */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="35" cy="35" r="28" fill="none" stroke="#5eead4" strokeWidth="6"
                  strokeDasharray="105 176" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white">60%</span>
                <span className="text-[10px] text-slate-400">Avg Risk</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">AI Medical Analytics</div>
              <div className="text-xs text-slate-400 mt-0.5">Population Average</div>
              <div className="text-[11px] text-slate-500 mt-1">Based on 10,000 patient records</div>
            </div>
          </div>

          {/* Model Performance */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur p-5">
            <div className="text-sm font-medium text-slate-300 mb-3">Model Performance</div>
            <div className="grid grid-cols-4 gap-2">
              {metrics.map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="text-sm font-bold text-teal-400">{val}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
