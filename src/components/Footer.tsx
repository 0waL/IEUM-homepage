import Link from "next/link";
import { ExternalLink, Github, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getContactInfo() {
  const items = await prisma.siteContent.findMany({
    where: { key: { in: ["footer_website", "footer_github", "footer_email"] } },
  });
  const map: Record<string, string> = {};
  items.forEach((i) => { map[i.key] = i.value; });
  return {
    website: map["footer_website"] ?? "https://gshs.app",
    github: map["footer_github"] ?? "https://github.com",
    email: map["footer_email"] ?? "contact@gshs.app",
  };
}

export async function Footer() {
  const contact = await getContactInfo();

  return (
    <footer className="bg-navy-900 border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 justify-between">
          {/* Links */}
          <div>
            <h3 className="font-semibold text-zinc-400 mb-3 text-sm">바로가기</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: "/about", label: "동아리 소개" },
                { href: "/activities", label: "활동 & 포트폴리오" },
                { href: "/members", label: "멤버 소개" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-zinc-400 mb-3 text-sm">연락처</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <ExternalLink size={13} />
                  {contact.website.replace(/^https?:\/\//, "")}
                </a>
              </li>
              <li>
                <a
                  href={contact.github}
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
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <Mail size={13} />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} 이음(IEUM). All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">경남과학고 IT 동아리</p>
        </div>
      </div>
    </footer>
  );
}
