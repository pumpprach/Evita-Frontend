// components/predict/PredictionClient.tsx
"use client";

import { useState } from "react";
import PredictionForm from "./PredictionForm";
import ResultSection from "./ResultSection";
import ArchSection from "./ArchSection";
import { predictDiabetes } from "@/lib/api";
import { PredictionPayload, PredictionResult } from "@/types/prediction";

export default function PredictionClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: PredictionPayload) {
    setLoading(true);
    setError(null);
    try {
      const res = await predictDiabetes(payload);
      setResult(res);
      // scroll to result
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">🤖 AI Diabetes Risk Assessment</h1>
        <p className="text-slate-400">กรอกข้อมูลสุขภาพของคุณเพื่อรับการวิเคราะห์ด้วย AI</p>
      </div>

      <PredictionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="mt-6 p-4 bg-rose-900/30 border border-rose-700 rounded-xl text-rose-300 text-sm">
          ❌ {error}
        </div>
      )}

      {result && (
        <div id="result-section" className="result-reveal mt-8">
          <ResultSection result={result} />
        </div>
      )}

      <ArchSection />
    </div>
  );
}
