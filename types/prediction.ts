// types/prediction.ts

export interface PredictionPayload {
  Patient_ID: string;
  Age: number;
  Gender: number;
  Resting_HR: number;
  Sleep_HRV_Avg: number;
  Daily_Spot_SpO2: number;
  Sleep_Duration: number;
  Sleep_Efficiency: number;
  Sleep_Regularity_Index: number;
  Total_Daily_Steps: number;
  Sedentary_Hours: number;
  Clinical_Notes: string;
}

export interface ShapFactor {
  label: string;
  value: number;
  pct: string;
  positive: boolean; // true = เพิ่มความเสี่ยง, false = ลดความเสี่ยง
}

export interface PredictionResult {
  risk_score: number;      // 0–100
  top_factors: ShapFactor[];
}

export type RiskLevel = "low" | "medium" | "high";

export function getRiskLevel(score: number): RiskLevel {
  if (score > 70) return "high";
  if (score > 40) return "medium";
  return "low";
}

export const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; label: string; bgClass: string; borderClass: string; titleColor: string; textColor: string; title: string; advice: string }
> = {
  high: {
    color: "#e11d48",
    label: "High Risk",
    bgClass: "bg-rose-50",
    borderClass: "border-rose-200",
    titleColor: "text-rose-900",
    textColor: "text-rose-700",
    title: "⚠️ High Risk Detected",
    advice: "แนะนำให้พบแพทย์เพื่อตรวจระดับน้ำตาลในเลือดโดยเร็ว และปรับเปลี่ยนพฤติกรรมการใช้ชีวิต",
  },
  medium: {
    color: "#f59e0b",
    label: "Medium Risk",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    titleColor: "text-amber-900",
    textColor: "text-amber-700",
    title: "⚡ Medium Risk",
    advice: "ควรติดตามระดับน้ำตาลสม่ำเสมอ ออกกำลังกายและควบคุมอาหาร เพื่อลดความเสี่ยงในอนาคต",
  },
  low: {
    color: "#10b981",
    label: "Low Risk",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    titleColor: "text-emerald-900",
    textColor: "text-emerald-700",
    title: "✅ Low Risk",
    advice: "ความเสี่ยงอยู่ในระดับต่ำ ดูแลสุขภาพให้สม่ำเสมอ ออกกำลังกายและรับประทานอาหารที่มีประโยชน์ต่อไป",
  },
};
