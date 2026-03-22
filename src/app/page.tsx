import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Users,
  Lightbulb,
  Heart,
  Trophy,
  BookOpen,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroTitle } from "@/components/HeroTitle";

export const revalidate = 30;

const DEFAULT_MISSION =
  "이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다. 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.\n\n대표 프로젝트인 gshs.app은 경남과학고 학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로, 현재도 많은 학생들이 매일 사용하고 있습니다.";

const DEFAULT_HISTORY = [
  { year: "2025", events: ["이음 동아리 공식 홈페이지 오픈", "gshs.app v2.0 출시"] },
  { year: "2024", events: ["gshs.app 리뉴얼 작업 시작", "교내 해커톤 참가", "신입부원 모집"] },
  { year: "2023", events: ["이음(IEUM) 동아리 창설", "gshs.app v1.0 개발 및 출시"] },
];

async function getSiteData() {
  const [contentItems, faqItems] = await Promise.all([
    prisma.siteContent.findMany(),
    prisma.fAQ.findMany({ orderBy: { order: "asc" } }),
  ]);
  const contentMap: Record<string, string> = {};
  contentItems.forEach((c) => { contentMap[c.key] = c.value; });
  const rawHistory: { year: string; events: string[] }[] = (() => {
    try { return contentMap["about_history"] ? JSON.parse(contentMap["about_history"]) : DEFAULT_HISTORY; }
    catch { return DEFAULT_HISTORY; }
  })();
  const map = new Map<string, string[]>();
  for (const item of rawHistory) map.set(item.year, [...(map.get(item.year) ?? []), ...item.events]);
  const history = Array.from(map.entries())
    .map(([year, events]) => ({ year, events }))
    .sort((a, b) => Number(b.year) - Number(a.year));

  return {
    missionText: contentMap["mission_text"] ?? DEFAULT_MISSION,
    faqs: faqItems,
    history,
  };
}


async function getStats() {
  const [memberCount, postCount] = await Promise.all([
    prisma.member.count({ where: { active: true } }),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { memberCount, postCount };
}

export default async function HomePage() {
  const [stats, siteData] = await Promise.all([getStats(), getSiteData()]);
  const { missionText, faqs, history } = siteData;
  const missionParagraphs = missionText.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-navy-950 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-40 w-[700px] h-[700px] hero-orb-1 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 -right-40 w-[650px] h-[650px] hero-orb-2 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] hero-orb-3 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] hero-orb-4 rounded-full blur-[90px]" />
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--hero-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-color) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Grid fade - 가장자리를 흐리게 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--hero-fade-stop) 100%)",
          }}
        />

        {/* Ghost background text */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden select-none pointer-events-none px-4 sm:px-8">
          <span
            className="hero-ghost-ko font-black leading-none tracking-tighter text-white/[0.04]"
            style={{ fontSize: "clamp(6rem, 28vw, 36rem)" }}
          >
            이음
          </span>
          <span
            className="hero-ghost-en font-black leading-none tracking-tighter text-white/[0.03]"
            style={{ fontSize: "clamp(4rem, 20vw, 26rem)" }}
          >
            IEUM
          </span>
        </div>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-24 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-950/60 border border-primary-800/50 rounded-full text-sm text-primary-300 mb-10 hero-badge">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            경남과학고 IT 동아리
          </div>

          {/* Giant title */}
          <HeroTitle />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-zinc-400 text-xl leading-relaxed max-w-lg">
              학교와 기술을 잇는 경남과학고 IT 동아리.
              <br />
              함께 만들고, 함께 성장합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/40"
              >
                소개 보기
                <ArrowRight size={16} />
              </a>
              <a
                href="https://gshs.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-zinc-300 rounded-full font-semibold hover:bg-white/5 transition-all"
              >
                gshs.app
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-navy-900 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: `${stats.memberCount}+`, label: "활동 멤버" },
              { value: `${stats.postCount}+`, label: "활동 기록" },
              { value: "1+", label: "운영 서비스" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About / Mission ─── */}
      <section id="about" className="py-32 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
                이음(IEUM)이란?
              </h2>
              {missionParagraphs.map((para, i) => (
                <p key={i} className="text-zinc-400 leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
            <div className="mission-card bg-gradient-to-br from-primary-950 to-navy-800 rounded-2xl border border-primary-900/40 p-10 text-center">
              <div className="text-6xl mb-5">🔗</div>
              <blockquote className="text-primary-300 font-semibold text-xl italic">
                &ldquo;연결하다, 잇다, 이음&rdquo;
              </blockquote>
              <p className="text-zinc-500 text-sm mt-3">
                기술로 사람과 사람을, 학교와 학생을 연결합니다
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Activities ─── */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">우리가 하는 일</h2>
            <p className="text-zinc-400 text-lg">기술로 학교를 더 편리하게</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "서비스 개발",
                desc: "gshs.app을 포함한 학교 학생들을 위한 웹 서비스를 직접 기획하고 개발합니다.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0,
              },
              {
                icon: Users,
                title: "스터디 & 세미나",
                desc: "서로의 지식을 나누는 스터디와 세미나를 정기적으로 진행합니다.",
                gradient: "from-primary-500 to-violet-500",
                delay: 100,
              },
              {
                icon: Lightbulb,
                title: "해커톤 & 공모전",
                desc: "다양한 해커톤과 공모전에 참여해 실력을 키우고 팀워크를 다집니다.",
                gradient: "from-amber-500 to-orange-500",
                delay: 200,
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
                <div className="bg-navy-800 border border-white/8 rounded-2xl p-7 hover:border-primary-600/30 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <item.icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">우리가 추구하는 것</h2>
            <p className="text-zinc-400 text-lg">이음의 핵심 가치</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "실전 경험",
                desc: "교과서 밖에서, 실제로 사용되는 서비스를 직접 만들며 배웁니다.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0,
              },
              {
                icon: Users,
                title: "팀워크",
                desc: "혼자가 아닌 팀으로, 서로의 강점을 모아 더 큰 것을 만듭니다.",
                gradient: "from-green-500 to-emerald-500",
                delay: 60,
              },
              {
                icon: Trophy,
                title: "성장",
                desc: "스터디, 해커톤, 공모전을 통해 지속적으로 실력을 키워갑니다.",
                gradient: "from-amber-500 to-yellow-500",
                delay: 120,
              },
              {
                icon: Heart,
                title: "기여",
                desc: "우리가 만드는 서비스로 학교 구성원의 삶을 더 편리하게 만듭니다.",
                gradient: "from-rose-500 to-pink-500",
                delay: 0,
              },
              {
                icon: BookOpen,
                title: "지식 공유",
                desc: "배운 것을 나누고, 함께 공부하며 집단 지성을 키웁니다.",
                gradient: "from-primary-500 to-violet-500",
                delay: 60,
              },
              {
                icon: Lightbulb,
                title: "도전",
                desc: "새로운 기술과 아이디어에 두려워하지 않고 도전합니다.",
                gradient: "from-orange-500 to-red-500",
                delay: 120,
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
                <div className="bg-navy-900 border border-white/8 rounded-2xl p-6 hover:border-primary-600/30 transition-all duration-300 hover:-translate-y-0.5 h-full">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <item.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-3">기술 스택</h2>
            <p className="text-zinc-400 text-lg">이음이 사용하는 언어와 도구들</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "React", category: "Frontend", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-800/30" },
              { name: "Next.js", category: "Frontend", color: "from-zinc-500/20 to-zinc-600/20", border: "border-zinc-700/30" },
              { name: "TypeScript", category: "Language", color: "from-blue-500/20 to-blue-600/20", border: "border-blue-800/30" },
              { name: "Tailwind CSS", category: "Styling", color: "from-teal-500/20 to-cyan-500/20", border: "border-teal-800/30" },
              { name: "Node.js", category: "Backend", color: "from-green-500/20 to-emerald-500/20", border: "border-green-800/30" },
              { name: "Prisma", category: "ORM", color: "from-primary-500/20 to-violet-500/20", border: "border-primary-800/30" },
              { name: "PostgreSQL", category: "Database", color: "from-blue-600/20 to-indigo-500/20", border: "border-blue-800/30" },
              { name: "Figma", category: "Design", color: "from-rose-500/20 to-pink-500/20", border: "border-rose-800/30" },
            ].map((tech, i) => (
              <FadeIn key={tech.name} delay={(i % 4) * 60}>
                <div
                  className={`bg-gradient-to-br ${tech.color} border ${tech.border} rounded-xl p-5 text-center hover:scale-105 transition-all duration-200`}
                >
                  <p className="tech-name font-semibold text-white">{tech.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{tech.category}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Project ─── */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="featured-card relative overflow-hidden rounded-2xl border border-primary-800/40 bg-gradient-to-br from-primary-950/80 via-navy-800 to-navy-800">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary-700/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
                    대표 프로젝트
                  </p>
                  <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
                    gshs.app
                  </h2>
                  <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
                    경남과학고 학생들을 위한 종합 정보 플랫폼. 급식, 시간표, 공지사항 등 학생들이
                    필요한 모든 정보를 한 곳에서 확인할 수 있습니다.
                  </p>
                  <a
                    href="https://gshs.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/40"
                  >
                    방문하기
                    <ExternalLink size={15} />
                  </a>
                </div>
                <div className="logo-box flex-shrink-0 w-36 h-36 bg-navy-950/60 rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white tracking-tighter">gshs</div>
                    <div className="text-primary-400 text-sm mt-1 font-medium">.app</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── History ─── */}
      {history.length > 0 && (
        <section className="py-24 bg-navy-900">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
            <FadeIn className="mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-2">연혁</h2>
              <p className="text-zinc-400 text-lg">이음의 발자취</p>
            </FadeIn>

            <div className="space-y-8">
              {history.map((item) => (
                <FadeIn key={item.year}>
                  <div className="flex gap-6 sm:gap-10">
                    <div className="flex-shrink-0 w-14 sm:w-20">
                      <span className="text-2xl font-black text-primary-400">{item.year}</span>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-2 ring-2 ring-primary-900 ring-offset-2 ring-offset-navy-900" />
                      <div className="w-px bg-white/10 flex-1 mt-1" />
                    </div>
                    <div className="flex-1 pb-4 space-y-2">
                      {item.events.map((event) => (
                        <p key={event} className="text-zinc-400 text-sm leading-relaxed">{event}</p>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-950/80 border border-primary-800/50 rounded-xl flex items-center justify-center text-xl">
                ❓
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2">자주 묻는 질문</h2>
            <p className="text-zinc-400">학생들이 자주 묻는 질문들을 모아봤어요</p>
          </FadeIn>
          <FadeIn delay={100}>
            <FAQAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      {/* ─── Join CTA ─── */}
      <section className="py-32 bg-navy-900 border-t border-white/5">
        <FadeIn className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-5xl font-black text-white mb-5 tracking-tighter">
            이음과 함께
            <br />
            만들어요
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            개발에 관심 있는 경남과학고 학생이라면 누구든 환영합니다.
          </p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/40 text-base"
          >
            멤버 보기
            <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
