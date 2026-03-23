"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ExternalLink, Sun, Moon } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/activities", label: "활동" },
  { href: "/members", label: "멤버" },
  { href: "/inquiries", label: "문의" },
];

export function Navbar({ applyEnabled, applyDeadline }: { applyEnabled: boolean; applyDeadline: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4 pointer-events-none">
      {/* Pill */}
      <nav className="navbar-pill pointer-events-auto flex items-center gap-1 bg-navy-900/90 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 shadow-2xl shadow-black/40">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center px-4 py-1.5 rounded-full font-bold text-sm text-white hover:bg-white/10 transition-colors mr-1 flex-shrink-0">
          홈
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://gshs.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            gshs.app
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="테마 변경"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Auth (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {applyEnabled && (
            <Link
              href="/apply"
              title={applyDeadline ? `마감: ${applyDeadline}` : undefined}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive("/apply")
                  ? "bg-white/10 text-white"
                  : "text-primary-400 hover:text-primary-300 hover:bg-white/5"
              }`}
            >
              지원하기
            </Link>
          )}
          {session ? (
            <>
              <Link
                href="/admin"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                관리자
              </Link>
              <LogoutButton className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors" />
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-500 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile: apply shortcut + hamburger */}
        <div className="flex md:hidden items-center gap-1 ml-1">
          {applyEnabled && (
            <Link href="/apply" className="px-3 py-1.5 text-xs font-semibold text-primary-400 rounded-full hover:bg-white/5 transition-colors">
              지원하기
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-xs bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://gshs.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            gshs.app <ExternalLink size={12} />
          </a>
          <div className="mt-1 pt-1 border-t border-white/10">
            {session ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  관리자
                </Link>
                <div className="px-2">
                  <LogoutButton className="flex items-center gap-1.5 w-full px-3 py-2 text-sm text-zinc-500 hover:text-red-400 transition-colors" />
                </div>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600/20 hover:bg-primary-600/30 transition-colors text-center"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
