// @/lib/api.ts

// ชี้ไปที่ Backend FastAPI ของเรา (ถ้าขึ้น Cloud แล้วค่อยมาเปลี่ยน URL ตรงนี้)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ฟังก์ชันสำหรับ Polling รอข้อมูลจาก Webhook
export async function fetchWatchData() {
  const response = await fetch(`${API_BASE_URL}/api/debug/fetch_watch_data`);
  
  if (!response.ok) {
    throw new Error("Data not ready yet");
  }
  
  return response.json();
}

// ฟังก์ชันสำหรับส่งข้อมูล 7 วันไปทำนายผลความเสี่ยง
export async function predictDiabetes(payload: any) {
  const response = await fetch(`${API_BASE_URL}/api/predict_risk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // ห่อข้อมูลให้ตรงกับ schema PredictionRequest ของ Backend
    body: JSON.stringify({ user_history: payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Prediction request failed");
  }

  return response.json();
}