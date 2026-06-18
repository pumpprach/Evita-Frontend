// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Evita — AI Diabetes Risk Prediction",
  description: "ประเมินความเสี่ยงโรคเบาหวานด้วยปัญญาประดิษฐ์ แม่นยำ รวดเร็ว",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
