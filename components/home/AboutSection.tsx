// components/home/AboutSection.tsx
const cards = [
  {
    icon: "🩸",
    bg: "bg-emerald-50",
    title: "ระดับน้ำตาลในเลือด",
    desc: "ระดับกลูโคสในเลือดที่สูงเกินไปเป็นสัญญาณสำคัญ Fasting glucose >126 mg/dL บ่งชี้ความเสี่ยงสูง",
  },
  {
    icon: "⚖️",
    bg: "bg-orange-50",
    title: "ดัชนีมวลกาย (BMI)",
    desc: "BMI เกิน 25 เพิ่มความเสี่ยงอย่างมีนัยสำคัญ ไขมันสะสมบริเวณช่องท้องส่งผลต่อการตอบสนองต่ออินซูลิน",
  },
  {
    icon: "🧬",
    bg: "bg-purple-50",
    title: "ประวัติครอบครัว",
    desc: "มีประวัติครอบครัวเป็นเบาหวานเพิ่มความเสี่ยงถึง 2-3 เท่า พันธุกรรมมีบทบาทสำคัญในการเกิดโรค",
  },
];

export default function AboutSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">เกี่ยวกับโรคเบาหวาน</h2>
        <p className="text-slate-400 text-sm">ทำความเข้าใจปัจจัยเสี่ยงและการป้องกัน</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {cards.map(({ icon, bg, title, desc }) => (
          <div key={title} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
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
