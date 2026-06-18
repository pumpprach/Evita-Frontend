import PredictionClient from "@/components/predict/PredictionClient";

export const metadata = {
  title: "EVITA MVP Dashboard",
  description: "EVITA MVP diabetes risk dashboard with Apple Watch trends and SHAP insights",
};

export default function PredictPage() {
  return <PredictionClient />;
}
