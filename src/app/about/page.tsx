import type { Metadata } from "next";
import { Code2, Users, Trophy, Heart, BookOpen, Zap } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "소개",
  description: "경남과학고 IT 동아리 이음(IEUM)을 소개합니다.",
};

const VALUE_ICONS = [Code2, Users, Trophy, Heart, BookOpen, Zap];
const VALUE_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-amber-500 to-yellow-500",
  "from-rose-500 to-pink-500",
  "from-primary-500 to-violet-500",
  "from-orange-500 to-red-500",
];

const DEFAULT_HERO_SUBTITLE =
  "연결하다, 잇다, 이음.\n학교와 기술을 이어 더 나은 학교 생활을 만듭니다.";
const DEFAULT_MISSION_TITLE = "우리의 미션";
const DEFAULT_MISSION_BODY =
  "이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다.\n우리는 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.\n\n대표 프로젝트인 gshs.app은 경남과학고 학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로, 현재도 많은 학생들이 매일 사용하고 있습니다.";
const DEFAULT_QUOTE = "연결하다, 잇다, 이음";
const DEFAULT_QUOTE_SUB = "기술로 사람과 사람을, 학교와 학생을 연결합니다";
const DEFAULT_VALUES = [
  { title: "실전 경험", desc: "교과서 밖에서, 실제로 사용되는 서비스를 직접 만들며 배웁니다." },
  { title: "팀워크", desc: "혼자가 아닌 팀으로, 서로의 강점을 모아 더 큰 것을 만듭니다." },
  { title: "성장", desc: "스터디, 해커톤, 공모전을 통해 지속적으로 실력을 키워갑니다." },
  { title: "기여", desc: "우리가 만드는 서비스로 학교 구성원의 삶을 더 편리하게 만듭니다." },
  { title: "지식 공유", desc: "배운 것을 나누고, 함께 공부하며 집단 지성을 키웁니다." },
  { title: "도전", desc: "새로운 기술과 아이디어에 두려워하지 않고 도전합니다." },
];
const DEFAULT_TECHSTACK = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Backend" },
  { name: "Prisma", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Figma", category: "Design" },
];
const DEFAULT_HISTORY = [
  { year: "2025", events: ["이음 동아리 공식 홈페이지 오픈", "gshs.app v2.0 출시"] },
  { year: "2024", events: ["gshs.app 리뉴얼 작업 시작", "교내 해커톤 참가", "신입부원 모집"] },
  { year: "2023", events: ["이음(IEUM) 동아리 창설", "gshs.app v1.0 개발 및 출시"] },
];

function parseJson<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

function mergeHistory(raw: { year: string; events: string[] }[]) {
  const map = new Map<string, string[]>();
  for (const item of raw) {
    map.set(item.year, [...(map.get(item.year) ?? []), ...item.events]);
  }
  return Array.from(map.entries())
    .map(([year, events]) => ({ year, events }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export default async function AboutPage() {
  const items = await prisma.siteContent.findMany();
  const c: Record<string, string> = {};
  items.forEach((i) => { c[i.key] = i.value; });

  const heroSubtitle = c["about_hero_subtitle"] ?? DEFAULT_HERO_SUBTITLE;
  const missionTitle = c["about_mission_title"] ?? DEFAULT_MISSION_TITLE;
  const missionBody = c["about_mission_body"] ?? DEFAULT_MISSION_BODY;
  const quote = c["about_quote"] ?? DEFAULT_QUOTE;
  const quoteSub = c["about_quote_sub"] ?? DEFAULT_QUOTE_SUB;
  const values = parseJson<{ title: string; desc: string }[]>(c["about_values"], DEFAULT_VALUES);
  const techstack = parseJson<{ name: string; category: string }[]>(c["about_techstack"], DEFAULT_TECHSTACK);
  const history = mergeHistory(parseJson<{ year: string; events: string[] }[]>(c["about_history"], DEFAULT_HISTORY));

  const missionParagraphs = missionBody.split(/\n\n+/).filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-800/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              이음(IEUM)이란?
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed whitespace-pre-line">
              {heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-5">{missionTitle}</h2>
              {missionParagraphs.map((para, i) => (
                <p key={i} className="text-zinc-400 leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
            <div className="bg-gradient-to-br from-primary-950 to-navy-800 rounded-2xl border border-primary-900/40 p-10 text-center">
              <div className="text-6xl mb-5">🔗</div>
              <blockquote className="text-primary-300 font-semibold text-lg italic">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <p className="text-zinc-500 text-sm mt-3">{quoteSub}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-3">핵심 가치</h2>
            <p className="text-zinc-400 text-lg">이음이 추구하는 것들</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((item, idx) => {
              const Icon = VALUE_ICONS[idx % VALUE_ICONS.length];
              const gradient = VALUE_GRADIENTS[idx % VALUE_GRADIENTS.length];
              return (
                <FadeIn key={idx} delay={(idx % 3) * 80}>
                  <div className="bg-navy-900 rounded-2xl p-7 border border-transparent hover:border-primary-600/30 transition-all duration-300 hover:-translate-y-0.5 h-full">
                    <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">기술 스택</h2>
            <p className="text-zinc-400 text-lg">이음이 사용하는 기술들</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techstack.map((tech) => (
              <div
                key={tech.name}
                className="bg-navy-800 rounded-xl p-4 text-center border border-transparent hover:border-primary-600/30 transition-all duration-200"
              >
                <p className="font-semibold text-white">{tech.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-3">연혁</h2>
            <p className="text-zinc-400 text-lg">이음의 발자취</p>
          </FadeIn>
          <div className="space-y-6">
            {history.map((item) => (
              <FadeIn key={item.year}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="text-primary-400 font-bold text-lg">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mt-1.5 ring-2 ring-primary-900 ring-offset-2 ring-offset-navy-950" />
                    <div className="w-px bg-white/10 flex-1 mt-1" />
                  </div>
                  <div className="flex-1 pb-6">
                    <ul className="space-y-2">
                      {item.events.map((event) => (
                        <li key={event} className="text-zinc-400">{event}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
