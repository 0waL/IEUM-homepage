import Link from "next/link";
import { ExternalLink, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">이음</span>
              </div>
              <span className="font-bold text-gray-900">IEUM</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              경남과학고 IT 동아리 이음(IEUM)
              <br />
              연결하다, 잇다, 이음.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">바로가기</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "동아리 소개" },
                { href: "/activities", label: "활동 & 포트폴리오" },
                { href: "/members", label: "멤버 소개" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">연락처</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://gshs.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink size={14} />
                  gshs.app
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Github size={14} />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@gshs.app"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Mail size={14} />
                  contact@gshs.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} 이음(IEUM). All rights reserved.
          </p>
          <p className="text-xs text-gray-400">경남과학고 IT 동아리</p>
        </div>
      </div>
    </footer>
  );
}
