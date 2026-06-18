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
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900/85 px-6 py-4 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-400" />
        EVITA
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "text-sm font-medium transition-colors",
              path === href ? "text-teal-400" : "text-slate-400 hover:text-slate-100"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/predict"
        className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-400"
      >
        Open Dashboard
      </Link>
    </nav>
  );
}
