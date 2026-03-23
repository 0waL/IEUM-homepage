import { prisma } from "@/lib/prisma";

async function getFooterInfo() {
  const items = await prisma.siteContent.findMany({
    where: { key: { in: ["footer_developer", "footer_github", "footer_email"] } },
  });
  const map: Record<string, string> = {};
  items.forEach((i) => { map[i.key] = i.value; });
  return {
    developer: map["footer_developer"] ?? "이음 개발팀",
    github: map["footer_github"] ?? "",
    email: map["footer_email"] ?? "contact@gshs.app",
  };
}

export async function Footer() {
  const info = await getFooterInfo();

  return (
    <footer className="bg-navy-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Left */}
          <div className="space-y-1">
            <p className="text-sm font-bold text-zinc-100">이음(IEUM)</p>
            <p className="text-xs text-zinc-500">경남과학고등학교 IT 동아리</p>
            <p className="text-xs text-zinc-500">개발자 · {info.developer}</p>
            <p className="text-xs text-zinc-600 pt-1">
              © {new Date().getFullYear()} 이음(IEUM). All rights reserved.
            </p>
          </div>

          {/* Right: external links */}
          <div className="flex items-center gap-4">
            {info.github && (
              <a
                href={info.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                GitHub
              </a>
            )}
            {info.email && (
              <a
                href={`mailto:${info.email}`}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {info.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
