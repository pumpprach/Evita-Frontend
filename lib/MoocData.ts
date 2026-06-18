// lib/mockData.ts  — ข้อมูลจำลองสำหรับ Dashboard
import { PatientRecord, getRiskLevel } from "@/types/prediction";

function randomBetween(a: number, b: number) {
  return +(Math.random() * (b - a) + a).toFixed(1);
}

const topFactors = [
  "Age",
  "Gender",
  "Resting_HRV",
  "Sleep_HRV_Avg",
  "Daily_Spot_SpO2",
  "Sleep_Duration",
  "Sleep_Efficiency",
  "Sleep_Regularity_Index",
  "Total_Daily_Steps",
  "Sedentary_Hours",
  "Clinical_Notes",

];

const firstNames = ["สมชาย","สมหญิง","วิชัย","นภา","เอกชัย","ปิยะ","กมลา","ธนา","อรุณ","ชลิตา",
  "ประสิทธิ์","มาลี","สุรชัย","ดวงใจ","กิตติ","ศศิ","ชัยวัฒน์","รัตนา","ณัฐ","พิมพ์"];
const lastNames = ["สุขใจ","ใจดี","มีสุข","รักษา","พงษ์ดี","บุญมี","ศรีสุข","ดีงาม","มงคล","สว่าง"];

export const MOCK_PATIENTS: PatientRecord[] = Array.from(
  { length: 40 },
  (_, i) => {
    const score = Math.floor(Math.random() * 100);

    return {
      id: `P${String(i + 1).padStart(3, "0")}`,
      name: `${firstNames[i % firstNames.length]} ${
        lastNames[i % lastNames.length]
      }`,

      age: Math.floor(randomBetween(22, 75)),
      gender: Math.random() > 0.5 ? "M" : "F",

      riskScore: score,
      riskLevel: getRiskLevel(score),

      date: new Date(
        Date.now() - Math.random() * 30 * 86400000
      ).toISOString(),

      topFactor:
        topFactors[Math.floor(Math.random() * topFactors.length)],

      restingHR: Math.floor(randomBetween(55, 95)),
      hrv: Math.floor(randomBetween(18, 80)),
      spo2: randomBetween(93, 99),

      sleepDuration: randomBetween(4.5, 9),
      sleepEfficiency: randomBetween(70, 98),
      sleepRegularity: randomBetween(50, 100),

      steps: Math.floor(randomBetween(2000, 14000)),
      sedentaryHours: randomBetween(2, 12),

      clinicalNotes:
        Math.random() > 0.7
          ? "Family history of diabetes"
          : "No significant findings",
    };
  }
);

export function getDashboardStats(patients: PatientRecord[]) {
  const high   = patients.filter(p => p.riskLevel === "high").length;
  const medium = patients.filter(p => p.riskLevel === "medium").length;
  const low    = patients.filter(p => p.riskLevel === "low").length;
  const avgAge = +(patients.reduce((s, p) => s + p.age, 0) / patients.length).toFixed(1);
  const avgRisk = +(patients.reduce((s, p) => s + p.riskScore, 0) / patients.length).toFixed(1);

  const factorCount: Record<string, number> = {};
  patients.forEach(p => {
    factorCount[p.topFactor] = (factorCount[p.topFactor] || 0) + 1;
  });
  const topFactors = Object.entries(factorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count, pct: +((count / patients.length) * 100).toFixed(1) }));

  // age groups
  const ageGroups = [
    { label: "<30", count: patients.filter(p => p.age < 30).length },
    { label: "30–44", count: patients.filter(p => p.age >= 30 && p.age < 45).length },
    { label: "45–59", count: patients.filter(p => p.age >= 45 && p.age < 60).length },
    { label: "60+", count: patients.filter(p => p.age >= 60).length },
  ];

  return { high, medium, low, avgAge, avgRisk, topFactors, ageGroups, total: patients.length };
}