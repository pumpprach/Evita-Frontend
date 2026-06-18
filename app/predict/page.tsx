// app/predict/page.tsx
import PredictionClient from "@/components/predict/PredictionClient";

export const metadata = { title: "Evita — Prediction" };

export default function PredictPage() {
  return <PredictionClient />;
}
