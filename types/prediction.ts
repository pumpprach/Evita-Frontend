export const HEALTH_FIELDS = [
  "Sleep_Duration",
  "Sleep_Efficiency",
  "Sleep_Regularity_Index",
  "Resting_Heart_Rate",
  "Sleep_HRV_Avg",
  "Daily_Spot_SpO2",
  "Total_Daily_Steps",
  "Sedentary_Hours",
] as const;

export type HealthField = (typeof HEALTH_FIELDS)[number];

export interface HealthDay {
  Date: string;
  Sleep_Duration: number;
  Sleep_Efficiency: number;
  Sleep_Regularity_Index: number;
  Resting_Heart_Rate: number;
  Sleep_HRV_Avg: number;
  Daily_Spot_SpO2: number;
  Total_Daily_Steps: number;
  Sedentary_Hours: number;
}

export interface DailyHealthData extends HealthDay {
  Age: number;
  Gender: number;
  Clinical_Note: string;
}

export type PredictRiskPayload = DailyHealthData[];

export interface PredictionClassScores {
  risk_score_percentage: number;
  risk_level: 0 | 1 | 2;
  risk_score_0: number;
  risk_score_1: number;
  risk_score_2: number;
}

export interface ShapInsightFactor {
  feature: string;
  value: number;
  impact_score: number;
}

export interface PredictionInsights {
  top_driving_factors: ShapInsightFactor[];
  top_reducing_factors: ShapInsightFactor[];
}

export interface PredictionApiResponse {
  status: string;
  prediction: PredictionClassScores;
  insights: PredictionInsights;
}

export type PredictionResult = PredictionApiResponse;

export type RiskLevel = "low" | "medium" | "high";

export const RISK_LEVELS: Record<
  0 | 1 | 2,
  {
    key: RiskLevel;
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    summary: string;
  }
> = {
  0: {
    key: "low",
    label: "Low Risk",
    color: "#10b981",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    summary: "Current wearable and clinical signals indicate a lower diabetes risk profile.",
  },
  1: {
    key: "medium",
    label: "Medium Risk",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    summary: "Several signals suggest moderate risk. Watch sleep, activity, and symptom trends.",
  },
  2: {
    key: "high",
    label: "High Risk",
    color: "#ef4444",
    bgClass: "bg-rose-50",
    textClass: "text-rose-700",
    borderClass: "border-rose-200",
    summary: "The model sees a high-risk pattern across the latest health and clinical signals.",
  },
};

export function getRiskConfig(level: number) {
  if (level === 0 || level === 1 || level === 2) return RISK_LEVELS[level];
  return RISK_LEVELS[0];
}

export function getRiskLevel(score: number): RiskLevel {
  if (score > 70) return "high";
  if (score > 40) return "medium";
  return "low";
}

export function formatFeatureName(feature: string) {
  return feature.replaceAll("_", " ");
}

export interface LegacyPredictionPayload {
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

export type PredictionPayload = LegacyPredictionPayload | PredictRiskPayload;

export interface ShapFactor {
  label: string;
  value: number;
  pct: string;
  positive: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  riskScore: number;
  riskLevel: RiskLevel;
  date: string;
  topFactor: string;
  restingHR: number;
  hrv: number;
  spo2: number;
  sleepDuration: number;
  sleepEfficiency: number;
  sleepRegularity: number;
  steps: number;
  sedentaryHours: number;
}
