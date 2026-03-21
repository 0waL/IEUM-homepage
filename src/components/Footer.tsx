import Link from "next/link";
import { ExternalLink, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 justify-between">
          {/* Links */}
          <div>
            <h3 className="font-semibold text-zinc-300 mb-3 text-sm">바로가기</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/about", label: "동아리 소개" },
                { href: "/activities", label: "활동 & 포트폴리오" },
                { href: "/members", label: "멤버 소개" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-zinc-300 mb-3 text-sm">연락처</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a
                  href="https://gshs.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <ExternalLink size={13} />
                  gshs.app
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <Github size={13} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@gshs.app"
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <Mail size={13} />
                  contact@gshs.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} 이음(IEUM). All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">경남과학고 IT 동아리</p>
        </div>
      </div>
    </footer>
  );
}
