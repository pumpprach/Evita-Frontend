// app/predict/page.tsx
import PredictionClient from "@/components/predict/PredictionClient";

export const metadata = {
  title: "Evita — Prediction",
  description: "EVITA MVP diabetes risk prediction with Apple Watch trend data",
};

export default function PredictPage() {
  return <PredictionClient />;
}
