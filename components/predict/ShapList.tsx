// components/predict/ShapList.tsx
import { ShapFactor } from "@/types/prediction";

interface Props {
  factors: ShapFactor[];
}

export default function ShapList({ factors }: Props) {
  if (!factors.length) return null;
  const max = factors[0].value || 1;

  return (
    <div className="flex flex-col gap-3">
      {factors.map((f) => {
        const pct = Math.min(90, (f.value / max) * 85);
        return (
          <div key={f.label} className="flex items-center gap-3 text-sm">
            <span className="w-44 shrink-0 text-slate-300 text-xs">{f.label}</span>
            <div className="flex-1 bg-slate-900/60 rounded-full h-6 overflow-hidden">
              <div
                className={`shap-bar h-full rounded-full flex items-center px-2 text-[11px] font-semibold text-white ${
                  f.positive ? "bg-rose-600" : "bg-emerald-600"
                }`}
                style={{ width: `${pct}%` }}
              >
                {f.pct}
              </div>
            </div>
            <span
              className={`w-14 text-right text-xs font-semibold ${
                f.positive ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {f.pct}
            </span>
          </div>
        );
      })}
    </div>
  );
}
