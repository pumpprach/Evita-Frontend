import { PredictRiskPayload, PredictionApiResponse } from "@/types/prediction";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function readErrorMessage(res: Response) {
  const fallback = `API error: ${res.status} ${res.statusText}`;

  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    if (typeof body?.message === "string") return body.message;
    if (typeof body?.error === "string") return body.error;
    return fallback;
  } catch {
    return fallback;
  }
}

export async function fetchWatchData(): Promise<unknown> {
  const res = await fetch(`${API_URL}/api/debug/fetch_watch_data`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json();
}

export async function predictDiabetes(
  payload: PredictRiskPayload
): Promise<PredictionApiResponse> {
  const res = await fetch(`${API_URL}/api/predict_risk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json();
}
