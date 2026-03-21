"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/activities", label: "활동" },
  { href: "/members", label: "멤버" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/40">
              <span className="text-white font-bold text-xs">이음</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">IEUM</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://gshs.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              gshs.app
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <Link
                href="/admin"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-500 transition-colors"
              >
                관리자
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-zinc-800 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://gshs.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400"
            >
              gshs.app <ExternalLink size={12} />
            </a>
            <div className="pt-2 border-t border-zinc-800">
              {session ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-primary-400"
                >
                  관리자 대시보드
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-zinc-400"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
