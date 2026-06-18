import { RiskLevel } from "./prediction";

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

  clinicalNotes: string;
}