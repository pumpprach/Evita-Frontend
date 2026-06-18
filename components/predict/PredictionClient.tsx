"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";
import { fetchWatchData, predictDiabetes } from "@/lib/api";
import {
  DailyHealthData,
  HEALTH_FIELDS,
  HealthDay,
  HealthField,
  PredictRiskPayload,
  PredictionApiResponse,
} from "@/types/prediction";
import ResultSection from "./ResultSection";

type DebugKey = keyof HealthDay;
type DebugValues = Record<DebugKey, string>;
type ChartId = "heart" | "sleep" | "activity";

const POLL_INTERVAL_MS = 3000;

const EMPTY_DEBUG_VALUES: DebugValues = {
  Date: "",
  Sleep_Duration: "",
  Sleep_Efficiency: "",
  Sleep_Regularity_Index: "",
  Resting_Heart_Rate: "",
  Sleep_HRV_Avg: "",
  Daily_Spot_SpO2: "",
  Total_Daily_Steps: "",
  Sedentary_Hours: "",
};

const DEBUG_FIELDS: Array<{ key: DebugKey; label: string; step?: string }> = [
  { key: "Date", label: "Date" },
  { key: "Sleep_Duration", label: "Sleep Duration", step: "0.1" },
  { key: "Sleep_Efficiency", label: "Sleep Efficiency", step: "0.1" },
  { key: "Sleep_Regularity_Index", label: "Sleep Regularity Index", step: "0.01" },
  { key: "Resting_Heart_Rate", label: "Resting Heart Rate", step: "1" },
  { key: "Sleep_HRV_Avg", label: "Sleep HRV Avg", step: "0.1" },
  { key: "Daily_Spot_SpO2", label: "Daily Spot SpO2", step: "0.1" },
  { key: "Total_Daily_Steps", label: "Total Daily Steps", step: "1" },
  { key: "Sedentary_Hours", label: "Sedentary Hours", step: "0.1" },
];

const FIELD_ALIASES: Record<HealthField, string[]> = {
  Sleep_Duration: ["Sleep_Duration", "sleep_duration", "sleepDuration", "sleep_hours"],
  Sleep_Efficiency: ["Sleep_Efficiency", "sleep_efficiency", "sleepEfficiency"],
  Sleep_Regularity_Index: [
    "Sleep_Regularity_Index",
    "sleep_regularity_index",
    "sleepRegularityIndex",
    "sleep_regularity",
  ],
  Resting_Heart_Rate: [
    "Resting_Heart_Rate",
    "resting_heart_rate",
    "Resting_HR",
    "resting_hr",
    "restingHeartRate",
  ],
  Sleep_HRV_Avg: ["Sleep_HRV_Avg", "sleep_hrv_avg", "sleepHrvAvg", "hrv"],
  Daily_Spot_SpO2: ["Daily_Spot_SpO2", "daily_spot_spo2", "dailySpotSpo2", "spo2"],
  Total_Daily_Steps: ["Total_Daily_Steps", "total_daily_steps", "totalDailySteps", "steps"],
  Sedentary_Hours: ["Sedentary_Hours", "sedentary_hours", "sedentaryHours"],
};

const DATE_ALIASES = ["Date", "date", "day", "timestamp", "created_at", "recorded_at"];

const DATA_KEYS = [
  "data",
  "health_data",
  "watch_data",
  "historical_data",
  "daily_data",
  "daily_health_data",
  "records",
  "history",
  "last_7_days",
  "days",
  "payload",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const darkInputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20";

export default function PredictionClient() {
  const [age, setAge] = useState("20");
  const [gender, setGender] = useState("1");
  const [clinicalNote, setClinicalNote] = useState("");
  const [debugValues, setDebugValues] = useState<DebugValues>(EMPTY_DEBUG_VALUES);
  const [historyData, setHistoryData] = useState<HealthDay[]>([]);
  const [dataSource, setDataSource] = useState("No watch or mock data loaded");
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [watchStatus, setWatchStatus] = useState("Waiting for Apple Watch Webhook...");
  const [watchNotice, setWatchNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionApiResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const heartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sleepCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activityCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRefs = useRef<Record<ChartId, Chart | null>>({
    heart: null,
    sleep: null,
    activity: null,
  });
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const latestDay = historyData.at(-1);
  const previewRows = useMemo(() => historyData.slice(-7), [historyData]);

  useEffect(() => {
    if (!historyData.length) return;

    const labels = historyData.map((day, index) => formatChartLabel(day.Date, index));

    function createChart(
      id: ChartId,
      canvas: HTMLCanvasElement | null,
      config: ChartConfiguration<"line", number[], string>
    ) {
      if (!canvas) return;
      chartRefs.current[id]?.destroy();
      chartRefs.current[id] = new Chart(canvas, config);
    }

    createChart(
      "heart",
      heartCanvasRef.current,
      buildLineConfig(labels, [
        lineDataset("Resting Heart Rate", historyData, "Resting_Heart_Rate", "#ef4444"),
        lineDataset("Sleep HRV Avg", historyData, "Sleep_HRV_Avg", "#14b8a6"),
        lineDataset("Daily Spot SpO2", historyData, "Daily_Spot_SpO2", "#6366f1"),
      ])
    );

    createChart(
      "sleep",
      sleepCanvasRef.current,
      buildLineConfig(
        labels,
        [
          lineDataset("Sleep Duration", historyData, "Sleep_Duration", "#0ea5e9"),
          lineDataset("Sleep Efficiency", historyData, "Sleep_Efficiency", "#8b5cf6"),
          lineDataset("Sleep Regularity Index", historyData, "Sleep_Regularity_Index", "#f59e0b", "y1"),
        ],
        true
      )
    );

    createChart(
      "activity",
      activityCanvasRef.current,
      buildLineConfig(
        labels,
        [
          lineDataset("Total Daily Steps", historyData, "Total_Daily_Steps", "#22c55e"),
          lineDataset("Sedentary Hours", historyData, "Sedentary_Hours", "#f97316", "y1"),
        ],
        true
      )
    );

    return () => {
      Object.values(chartRefs.current).forEach((chart) => chart?.destroy());
      chartRefs.current = { heart: null, sleep: null, activity: null };
    };
  }, [historyData]);

  useEffect(() => {
    return () => stopWatchPolling();
  }, []);

  function startWatchPolling() {
    setWatchModalOpen(true);
    setWatchStatus("Waiting for Apple Watch Webhook...");
    setWatchNotice(null);
    stopWatchPolling();

    void pollWatchData();
    pollTimerRef.current = setInterval(() => {
      void pollWatchData();
    }, POLL_INTERVAL_MS);
  }

  function stopWatchPolling() {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }

  async function pollWatchData() {
    try {
      const response = await fetchWatchData();
      const data = normalizeHistoricalData(response);

      if (!data.length) {
        setWatchStatus("Waiting for Apple Watch Webhook...");
        return;
      }

      stopWatchPolling();
      setWatchModalOpen(false);
      setWatchNotice("Apple Watch data received from Terra API Simulation.");
      renderCharts(data);
      fillDebugZone(data.at(-1)!);
      setDataSource("Apple Watch webhook data");
      setFormError(null);
    } catch {
      setWatchStatus("Waiting for Apple Watch Webhook... retrying");
    }
  }

  function renderCharts(data: HealthDay[]) {
    setHistoryData(data.slice(-7));
  }

  function generateMockData() {
    const data: HealthDay[] = Array.from({ length: 7 }, (_, index) => {
      const riskDrift = index / 6;

      return {
        Date: isoDateOffset(6 - index),
        Sleep_Duration: round(randomBetween(5.1, 6.9) - riskDrift * 0.25, 1),
        Sleep_Efficiency: round(randomBetween(72, 93) - riskDrift * 4, 1),
        Sleep_Regularity_Index: round(randomBetween(0.46, 0.91) - riskDrift * 0.08, 2),
        Resting_Heart_Rate: Math.round(randomBetween(64, 92) + riskDrift * 3),
        Sleep_HRV_Avg: round(randomBetween(24, 72) - riskDrift * 5, 1),
        Daily_Spot_SpO2: round(randomBetween(94, 99) - riskDrift * 0.5, 1),
        Total_Daily_Steps: Math.round(randomBetween(3300, 7900) - riskDrift * 700),
        Sedentary_Hours: round(randomBetween(6.5, 12.5) + riskDrift * 0.8, 1),
      };
    });

    renderCharts(data);
    fillDebugZone(data.at(-1)!);
    setDataSource("Mock Data Test");
    setClinicalNote(
      "Poor sleep consistency, fatigue, increased thirst, low physical activity, and long sedentary time over the past week."
    );
    setWatchNotice("Mock 7-day health data is loaded and ready for prediction.");
    setFormError(null);
  }

  function fillDebugZone(day7Data: HealthDay) {
    setDebugValues({
      Date: day7Data.Date,
      Sleep_Duration: String(day7Data.Sleep_Duration),
      Sleep_Efficiency: String(day7Data.Sleep_Efficiency),
      Sleep_Regularity_Index: String(day7Data.Sleep_Regularity_Index),
      Resting_Heart_Rate: String(day7Data.Resting_Heart_Rate),
      Sleep_HRV_Avg: String(day7Data.Sleep_HRV_Avg),
      Daily_Spot_SpO2: String(day7Data.Daily_Spot_SpO2),
      Total_Daily_Steps: String(day7Data.Total_Daily_Steps),
      Sedentary_Hours: String(day7Data.Sedentary_Hours),
    });
  }

  function collectPredictPayload(): PredictRiskPayload {
    const ageValue = parseRequiredNumber(age, "Age");
    const genderValue = parseRequiredNumber(gender, "Gender");

    if (!debugValues.Date.trim()) {
      throw new Error("Date is required in the Debug Zone.");
    }

    const row = HEALTH_FIELDS.reduce(
      (acc, field) => ({
        ...acc,
        [field]: parseRequiredNumber(debugValues[field], field.replaceAll("_", " ")),
      }),
      {
        Date: debugValues.Date.trim(),
        Age: ageValue,
        Gender: genderValue,
        Clinical_Note: clinicalNote.trim(),
      } as DailyHealthData
    );

    return [row];
  }

  async function submitPredictRisk() {
    setFormError(null);
    setResult(null);

    let payload: PredictRiskPayload;
    try {
      payload = collectPredictPayload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await predictDiabetes(payload);
      renderPredictionResult(response);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  }

  function renderPredictionResult(response: PredictionApiResponse) {
    setResult(response);
    window.setTimeout(() => {
      document.getElementById("result-zone")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-teal-600">
              Health Tech Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              EVITA MVP
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Apple Watch simulation, 7-day health trends, diabetes risk prediction, and SHAP insights.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <MetricPill label="Data Source" value={dataSource} />
            <MetricPill label="History" value={historyData.length ? `${historyData.length} days` : "--"} />
            <MetricPill label="Latest Day" value={latestDay?.Date || "--"} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8">
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              eyebrow="1. Connect Apple Watch"
              title="Terra API Simulation"
              description="Connect Apple Watch and wait for the backend webhook payload."
            />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={startWatchPolling}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
              >
                Connect Apple Watch
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Polling endpoint: <span className="font-semibold text-slate-950">/api/debug/fetch_watch_data</span>
              </div>
            </div>
            {watchNotice && (
              <p className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                {watchNotice}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              eyebrow="2. Mock Data Test"
              title="Instant 7-day demo data"
              description="Generate realistic wearable data ranges for dashboard preview."
            />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={generateMockData}
                className="rounded-2xl bg-linear-to-r from-teal-500 to-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-200 transition hover:from-teal-400 hover:to-sky-400"
              >
                Mock Data Test
              </button>
              <p className="text-sm leading-6 text-slate-600">
                Steps, sleep, oxygen, HRV, and sedentary values fill the charts and Debug Zone immediately.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            eyebrow="3. Daily Trend Charts"
            title="7-day wearable trends"
            description="Line charts update from Apple Watch webhook data or mock data."
          />
          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            <ChartCard title="Heart & Oxygen" canvasRef={heartCanvasRef} empty={!historyData.length} />
            <ChartCard title="Sleep Analysis" canvasRef={sleepCanvasRef} empty={!historyData.length} />
            <ChartCard title="Activity & Sedentary" canvasRef={activityCanvasRef} empty={!historyData.length} />
          </div>
        </section>

        {previewRows.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              eyebrow="Data Preview"
              title="7-day health data"
              description="Latest generated or received daily records."
            />
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-[980px] w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    {["Date", "Sleep", "Efficiency", "Regularity", "RHR", "HRV", "SpO2", "Steps", "Sedentary"].map(
                      (heading) => (
                        <th key={heading} className="border-b border-slate-200 px-3 py-3 font-bold">
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((day) => (
                    <tr key={day.Date} className="text-slate-700">
                      <PreviewCell>{day.Date}</PreviewCell>
                      <PreviewCell>{day.Sleep_Duration} h</PreviewCell>
                      <PreviewCell>{day.Sleep_Efficiency}%</PreviewCell>
                      <PreviewCell>{day.Sleep_Regularity_Index}</PreviewCell>
                      <PreviewCell>{day.Resting_Heart_Rate} bpm</PreviewCell>
                      <PreviewCell>{day.Sleep_HRV_Avg} ms</PreviewCell>
                      <PreviewCell>{day.Daily_Spot_SpO2}%</PreviewCell>
                      <PreviewCell>{day.Total_Daily_Steps}</PreviewCell>
                      <PreviewCell>{day.Sedentary_Hours} h</PreviewCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              eyebrow="4. User Inputs"
              title="Patient context"
              description="Age, gender, and clinical note are included in the prediction payload."
            />
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Age
                <input
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  type="number"
                  min="0"
                  className={inputClass}
                  placeholder="20"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Gender
                <select value={gender} onChange={(event) => setGender(event.target.value)} className={inputClass}>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Clinical Note
                <textarea
                  value={clinicalNote}
                  onChange={(event) => setClinicalNote(event.target.value)}
                  rows={8}
                  className={`${inputClass} resize-none leading-6`}
                  placeholder="Poor sleep, fatigue, and low physical activity"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm">
            <SectionHeader
              eyebrow="5. Debug Zone"
              title="Editable latest-day payload"
              description="Day 7 values are auto-filled and remain manually editable before prediction."
              inverse
            />
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-[760px] w-full border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {DEBUG_FIELDS.map((field) => (
                    <tr key={field.key}>
                      <td className="rounded-l-2xl bg-slate-800 px-3 py-2 font-semibold text-slate-200">
                        {field.label}
                      </td>
                      <td className="rounded-r-2xl bg-slate-800 px-3 py-2">
                        <input
                          value={debugValues[field.key]}
                          onChange={(event) =>
                            setDebugValues((current) => ({ ...current, [field.key]: event.target.value }))
                          }
                          type={field.key === "Date" ? "date" : "number"}
                          step={field.step}
                          className={darkInputClass}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              eyebrow="6. Predict Risk"
              title="Run diabetes risk prediction"
              description="Payload is sent as a list containing the editable Day 7 record."
            />
            <button
              type="button"
              onClick={submitPredictRisk}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-rose-200 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="spinner mr-3" />
                  Predicting...
                </>
              ) : (
                "Predict Diabetes Risk"
              )}
            </button>
          </div>
          {formError && (
            <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {formError}
            </p>
          )}
        </section>

        <section id="result-zone" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            eyebrow="7. Result Zone"
            title="Prediction and SHAP insights"
            description="Risk class probabilities and model drivers are shown after the backend response."
          />
          <div className="mt-6">
            {result ? (
              <ResultSection result={result} />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm font-medium text-slate-500">
                No prediction result yet.
              </div>
            )}
          </div>
        </section>
      </main>

      {watchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-600">Terra API Simulation</p>
                <h2 className="mt-2 text-2xl font-black">Connect Apple Watch</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopWatchPolling();
                  setWatchModalOpen(false);
                }}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="mt-6 flex flex-col items-center gap-5">
              <SimulatedQrCode />
              <p className="animate-pulse rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
                {watchStatus}
              </p>
              <p className="text-center text-sm leading-6 text-slate-500">
                Backend polling runs every 3 seconds until health data is available.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverse?: boolean;
}) {
  return (
    <div>
      <p className={`text-xs font-black uppercase tracking-[0.22em] ${inverse ? "text-teal-300" : "text-teal-600"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-2 text-2xl font-black tracking-tight ${inverse ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      <p className={`mt-2 text-sm leading-6 ${inverse ? "text-slate-400" : "text-slate-600"}`}>{description}</p>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-white px-3 py-2">
      <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  canvasRef,
  empty,
}: {
  title: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  empty: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</h3>
      <div className="relative mt-4 h-72">
        {empty && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 text-sm font-semibold text-slate-400">
            Load Apple Watch or mock data
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

function PreviewCell({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-slate-100 px-3 py-3">{children}</td>;
}

function SimulatedQrCode() {
  const cells = useMemo(() => createQrPattern(17), []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
      <div
        className="grid h-56 w-56 gap-1 rounded-2xl bg-slate-50 p-3"
        style={{ gridTemplateColumns: "repeat(17, minmax(0, 1fr))" }}
        aria-label="Simulated Apple Watch QR code"
      >
        {cells.map((active, index) => (
          <span
            key={index}
            className={`rounded-[2px] ${active ? "bg-slate-950" : "bg-transparent"}`}
          />
        ))}
      </div>
    </div>
  );
}

function buildLineConfig(
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    pointRadius: number;
    pointHoverRadius: number;
    borderWidth: number;
    yAxisID?: string;
  }>,
  dualAxis = false
): ChartConfiguration<"line", number[], string> {
  return {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#334155",
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            font: { family: "DM Sans", size: 11, weight: "bold" },
          },
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          padding: 12,
          displayColors: true,
        },
      },
      scales: {
        x: {
          grid: { color: "#e2e8f0" },
          ticks: { color: "#64748b", font: { family: "DM Sans", size: 11 } },
        },
        y: {
          beginAtZero: false,
          grid: { color: "#e2e8f0" },
          ticks: { color: "#64748b", font: { family: "DM Sans", size: 11 } },
        },
        ...(dualAxis
          ? {
              y1: {
                position: "right" as const,
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                ticks: { color: "#64748b", font: { family: "DM Sans", size: 11 } },
              },
            }
          : {}),
      },
    },
  };
}

function lineDataset(
  label: string,
  data: HealthDay[],
  field: HealthField,
  color: string,
  yAxisID = "y"
) {
  return {
    label,
    data: data.map((day) => day[field]),
    borderColor: color,
    backgroundColor: color,
    tension: 0.35,
    pointRadius: 3,
    pointHoverRadius: 5,
    borderWidth: 2.5,
    yAxisID,
  };
}

function normalizeHistoricalData(raw: unknown): HealthDay[] {
  const items = findHealthArray(raw);
  if (!items?.length) return [];

  return items
    .map((item, index) => normalizeHealthDay(item, index, items.length))
    .filter((item): item is HealthDay => Boolean(item))
    .slice(-7);
}

function normalizeHealthDay(item: unknown, index: number, total: number): HealthDay | null {
  if (!isRecord(item)) return null;

  let metricCount = 0;
  const values = HEALTH_FIELDS.reduce((acc, field) => {
    const value = readNumericValue(item, FIELD_ALIASES[field]);
    if (Number.isFinite(value)) metricCount += 1;
    return { ...acc, [field]: Number.isFinite(value) ? value : 0 };
  }, {} as Record<HealthField, number>);

  if (metricCount === 0) return null;

  const date = readStringValue(item, DATE_ALIASES) || isoDateOffset(total - 1 - index);

  return {
    Date: date,
    Sleep_Duration: values.Sleep_Duration,
    Sleep_Efficiency: values.Sleep_Efficiency,
    Sleep_Regularity_Index: values.Sleep_Regularity_Index,
    Resting_Heart_Rate: values.Resting_Heart_Rate,
    Sleep_HRV_Avg: values.Sleep_HRV_Avg,
    Daily_Spot_SpO2: values.Daily_Spot_SpO2,
    Total_Daily_Steps: values.Total_Daily_Steps,
    Sedentary_Hours: values.Sedentary_Hours,
  };
}

function findHealthArray(value: unknown, depth = 0): unknown[] | null {
  if (depth > 4) return null;

  if (Array.isArray(value)) {
    return value.some((item) => isRecord(item) && hasAnyHealthMetric(item)) ? value : null;
  }

  if (!isRecord(value)) return null;

  for (const key of DATA_KEYS) {
    const found = findHealthArray(value[key], depth + 1);
    if (found) return found;
  }

  for (const nestedValue of Object.values(value)) {
    const found = findHealthArray(nestedValue, depth + 1);
    if (found) return found;
  }

  return hasAnyHealthMetric(value) ? [value] : null;
}

function hasAnyHealthMetric(record: Record<string, unknown>) {
  return HEALTH_FIELDS.some((field) => FIELD_ALIASES[field].some((alias) => alias in record));
}

function readNumericValue(record: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return Number.NaN;
}

function readStringValue(record: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias];
    if (typeof value === "string" && value.trim()) return value.slice(0, 10);
    if (typeof value === "number") return String(value);
  }
  return "";
}

function parseRequiredNumber(value: string, label: string) {
  if (!value.trim()) throw new Error(`${label} is required.`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid number.`);
  return parsed;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function isoDateOffset(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function formatChartLabel(date: string, index: number) {
  if (!date) return `Day ${index + 1}`;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createQrPattern(size: number) {
  return Array.from({ length: size * size }, (_, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const inFinder =
      isFinderCell(row, col, 0, 0) ||
      isFinderCell(row, col, 0, size - 7) ||
      isFinderCell(row, col, size - 7, 0);

    if (inFinder) return true;
    return (row * 7 + col * 11 + row * col) % 5 === 0 || (row + col) % 11 === 0;
  });
}

function isFinderCell(row: number, col: number, top: number, left: number) {
  const y = row - top;
  const x = col - left;
  if (y < 0 || y > 6 || x < 0 || x > 6) return false;
  return y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4);
}
