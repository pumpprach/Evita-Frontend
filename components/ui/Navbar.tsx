// components/ui/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/predict", label: "Prediction" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-white">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
        Evita
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "text-sm font-medium transition-colors",
              path === href
                ? "text-teal-400"
                : "text-slate-400 hover:text-slate-100"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/predict"
        className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 text-sm font-semibold transition-colors"
      >
        เริ่มประเมิน →
      </Link>
    </nav>
  );
}
