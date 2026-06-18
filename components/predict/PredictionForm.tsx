// components/predict/PredictionForm.tsx
"use client";

import { useRef } from "react";
import { PredictionPayload } from "@/types/prediction";

interface Props {
  onSubmit: (payload: PredictionPayload) => void;
  loading: boolean;
}

export default function PredictionForm({ onSubmit, loading }: Props) {
  const refs = {
    age:             useRef<HTMLInputElement>(null),
    gender:          useRef<HTMLSelectElement>(null),
    rhr:             useRef<HTMLInputElement>(null),
    hrv:             useRef<HTMLInputElement>(null),
    spo2:            useRef<HTMLInputElement>(null),
    sleepDuration:   useRef<HTMLInputElement>(null),
    sleepEfficiency: useRef<HTMLInputElement>(null),
    sleepRegularity: useRef<HTMLInputElement>(null),
    steps:           useRef<HTMLInputElement>(null),
    sedentary:       useRef<HTMLInputElement>(null),
    clinicalNotes:   useRef<HTMLTextAreaElement>(null),
  };

  function handleSubmit() {
    const payload: PredictionPayload = {
      Patient_ID:            "WEB_USER",
      Age:                   parseInt(refs.age.current?.value ?? "0"),
      Gender:                parseInt(refs.gender.current?.value ?? "1"),
      Resting_HR:            parseFloat(refs.rhr.current?.value ?? "0"),
      Sleep_HRV_Avg:         parseFloat(refs.hrv.current?.value ?? "0"),
      Daily_Spot_SpO2:       parseFloat(refs.spo2.current?.value ?? "0"),
      Sleep_Duration:        parseFloat(refs.sleepDuration.current?.value ?? "0"),
      Sleep_Efficiency:      parseFloat(refs.sleepEfficiency.current?.value ?? "0"),
      Sleep_Regularity_Index:parseFloat(refs.sleepRegularity.current?.value ?? "0"),
      Total_Daily_Steps:     parseInt(refs.steps.current?.value ?? "0"),
      Sedentary_Hours:       parseFloat(refs.sedentary.current?.value ?? "0"),
      Clinical_Notes:        refs.clinicalNotes.current?.value ?? "",
    };
    onSubmit(payload);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* ── Card 1: Personal ── */}
      <FormCard icon="👤" title="Personal Information">
        <Field label="Age">
          <input ref={refs.age} type="number" className={inputCls} placeholder="35" />
        </Field>
        <Field label="Gender">
          <select ref={refs.gender} className={inputCls}>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </select>
        </Field>
      </FormCard>

      {/* ── Card 2: Health ── */}
      <FormCard icon="🩺" title="Health Metrics">
        <Field label="Resting Heart Rate (bpm)">
          <input ref={refs.rhr} type="number" className={inputCls} placeholder="72" />
        </Field>
        <Field label="Sleep HRV Average (ms)">
          <input ref={refs.hrv} type="number" className={inputCls} placeholder="45" />
        </Field>
        <Field label="SpO₂ (%)">
          <input ref={refs.spo2} type="number" className={inputCls} placeholder="97" />
        </Field>
        <Field label="Sleep Duration (hrs)">
          <input ref={refs.sleepDuration} type="number" step="0.1" className={inputCls} placeholder="7.5" />
        </Field>
        <Field label="Sleep Efficiency (%)">
          <input ref={refs.sleepEfficiency} type="number" className={inputCls} placeholder="85" />
        </Field>
        <Field label="Sleep Regularity Index">
          <input ref={refs.sleepRegularity} type="number" step="0.1" className={inputCls} placeholder="75" />
        </Field>
      </FormCard>

      {/* ── Card 3: Lifestyle ── */}
      <FormCard icon="🏃" title="Lifestyle Factors">
        <Field label="Total Daily Steps">
          <input ref={refs.steps} type="number" className={inputCls} placeholder="8000" />
        </Field>
        <Field label="Sedentary Hours">
          <input ref={refs.sedentary} type="number" step="0.5" className={inputCls} placeholder="8" />
        </Field>
        <Field label="Clinical Notes">
          <textarea
            ref={refs.clinicalNotes}
            rows={5}
            className={`${inputCls} resize-none`}
            defaultValue="มีโรคอ้วน ความดันโลหิตสูง ไขมันพอกตับ ประวัติครอบครัวเป็นเบาหวาน และไม่ออกกำลังกาย"
          />
        </Field>
        <div className="p-3 bg-teal-950/60 border border-teal-800/50 rounded-lg">
          <p className="text-xs text-teal-400 leading-relaxed">
            💡 ข้อมูลทั้งหมดถูกประมวลผลด้วย Random Forest Classifier ที่ผ่านการฝึกด้วยข้อมูล 10,000 ราย
          </p>
        </div>
      </FormCard>

      {/* Submit — full width */}
      <div className="md:col-span-3 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-60 text-slate-900 font-bold text-base rounded-2xl shadow-lg shadow-teal-900/40 transition-all"
        >
          {loading ? (
            <>
              <span className="spinner" />
              กำลังวิเคราะห์...
            </>
          ) : (
            "🔍 Predict Diabetes Risk"
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function FormCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-slate-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-900/70 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors";
