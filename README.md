# Evita — AI Diabetes Risk Prediction

## 🚀 วิธีสร้างโปรเจ็ค

### 1. สร้าง Next.js Project

```bash
npx create-next-app@latest evita \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd evita
```

### 2. ติดตั้ง Dependencies เพิ่มเติม

```bash
npm install chart.js react-chartjs-2 clsx
```

### 3. วาง Source Files

คัดลอกไฟล์ทั้งหมดจาก repo นี้ไปวางใน project:

```
src/
├── app/
│   ├── layout.tsx          ← Root layout + font
│   ├── page.tsx            ← Home page
│   ├── globals.css         ← Global styles + custom animations
│   ├── predict/
│   │   └── page.tsx        ← Prediction page
│   └── about/
│       └── page.tsx        ← About page
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx      ← Navigation bar
│   │   └── Footer.tsx      ← Footer
│   ├── charts/
│   │   ├── MiniBarChart.tsx ← Hero mini chart
│   │   └── ShapChart.tsx   ← SHAP bar chart (Chart.js)
│   ├── home/
│   │   ├── HeroSection.tsx ← Hero + cards
│   │   └── AboutSection.tsx← Diabetes info section
│   ├── predict/
│   │   ├── PredictionForm.tsx  ← Input form
│   │   ├── ResultSection.tsx   ← Gauge + advice
│   │   ├── ShapList.tsx        ← SHAP factor list
│   │   └── ArchSection.tsx     ← Architecture section
│   └── about/
│       └── AboutProject.tsx
├── lib/
│   └── api.ts              ← fetch /predict API
└── types/
    └── prediction.ts       ← TypeScript types
```

### 4. Run Development Server

```bash
npm run dev
# เปิด http://localhost:3000
```

### 5. Backend (FastAPI)

```bash
# แยก terminal
cd backend
pip install fastapi uvicorn scikit-learn joblib shap
uvicorn main:app --reload --port 8000
```

---

## 📁 โครงสร้างไฟล์ที่สำคัญ

| ไฟล์ | หน้าที่ |
|------|---------|
| `app/page.tsx` | Home — Hero + About Diabetes |
| `app/predict/page.tsx` | Prediction form + Result |
| `app/about/page.tsx` | About Project |
| `components/ui/Navbar.tsx` | Navigation (ใช้ `usePathname`) |
| `lib/api.ts` | POST `/predict` และ type-safe response |
| `types/prediction.ts` | Interface ทุก type |

---

## 🔧 Environment Variable (optional)

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```
