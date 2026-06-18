// components/predict/ArchSection.tsx

const flow = [
  { icon: "📝", label: "User Input",  sub: "13 features" },
  { icon: "⚡", label: "Frontend",    sub: "Next.js" },
  { icon: "🔌", label: "API Route",   sub: "/api/predict" },
  { icon: "🧠", label: "AI Model",    sub: "model.pkl" },
  { icon: "📊", label: "Dashboard",   sub: "Result + SHAP" },
];

const modelInfo = [
  {
    title: "Model Information",
    rows: [
      ["Algorithm",   "Random Forest"],
      ["Estimators",  "200 trees"],
      ["Max Depth",   "10"],
      ["Last Trained","June 2026"],
    ],
  },
  {
    title: "Performance Metrics",
    rows: [
      ["Accuracy",  "89.4%"],
      ["Precision", "87.2%"],
      ["Recall",    "85.9%"],
      ["F1-Score",  "86.5%"],
    ],
  },
  {
    title: "Dataset Info",
    rows: [
      ["Total Records",  "10,000"],
      ["Train / Test",   "80 / 20%"],
      ["Positive Cases", "34.2%"],
      ["Cross-Val",      "5-fold"],
    ],
  },
];

export default function ArchSection() {
  return (
    <div className="mt-8 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-8">
      <h2 className="text-xl font-bold text-white mb-1">AI System Architecture</h2>
      <p className="text-sm text-slate-400 mb-8">วิธีการทำงานของระบบตั้งแต่ input จนถึง prediction</p>

      {/* Flow */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {flow.map(({ icon, label, sub }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 min-w-[80px]">
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-xs font-semibold text-slate-200">{label}</span>
              <span className="text-[10px] text-slate-500">{sub}</span>
            </div>
            {i < flow.length - 1 && (
              <span className="text-slate-600 text-lg font-bold">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Info grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {modelInfo.map(({ title, rows }) => (
          <div key={title} className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/40">
            <h4 className="text-sm font-semibold text-slate-200 mb-3">{title}</h4>
            <div className="flex flex-col gap-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-teal-400 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
