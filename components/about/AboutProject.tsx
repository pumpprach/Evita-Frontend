// components/about/AboutProject.tsx
const cards = [
  {
    icon: "🤖",
    bg: "bg-blue-50",
    title: "Random Forest Classifier",
    desc: "ใช้ ensemble learning ด้วย 200 decision trees เพื่อให้ได้ความแม่นยำสูงสุด และลด overfitting",
  },
  {
    icon: "🔍",
    bg: "bg-purple-50",
    title: "Explainable AI (XAI)",
    desc: "ระบบอธิบายเหตุผลการทำนายด้วย SHAP values เพื่อให้เข้าใจว่าปัจจัยใดมีผลต่อ prediction มากที่สุด",
  },
  {
    icon: "⚡",
    bg: "bg-emerald-50",
    title: "Next.js + FastAPI",
    desc: "Frontend สร้างด้วย Next.js Backend เป็น FastAPI ที่โหลด sklearn model จากไฟล์ .pkl",
  },
  {
    icon: "📋",
    bg: "bg-orange-50",
    title: "การนำไปใช้งาน",
    desc: "Export model จาก Colab ด้วย joblib แล้ว deploy บน server เรียกใช้ผ่าน REST API endpoint /predict",
  },
];

export default function AboutProject() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">เกี่ยวกับโปรเจกต์</h1>
        <p className="text-slate-400 text-sm">
          AI Diabetes Risk Prediction System ใช้ Machine Learning ในการประเมินความเสี่ยง
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map(({ icon, bg, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-lg mb-4`}>
              {icon}
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
